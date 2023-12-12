Function Initialize(start Uint64, end Uint64, clock String, autoFinalize Uint64, partySize Uint64, fee Uint64, tokens String, recipients String) Uint64
10 STORE("END",end)
20 STORE("CLOCK",clock)
30 STORE("autoFinalize",autoFinalize)
40 STORE("tokens",tokens)
End Function

Function AddTokens(tokens String, )
10 RETURN addTokens(tokens,STRELEN(tokens)/64)
End Function

Function addTokens(tokens String, i Uint64) Uint64
10 IF i == 0 THEN GOTO 90
20 LET i = i -1
30 IF add("treasury:"+SUBSTR(tokens,i*64,64),ASSETVALUE(HEXDECODE(SUBSTR(tokens,i*64,64)))) THEN GOTO 10
90 RETURN 0
End Function

Function add(k String, v Uint64) Uint64
10 IF EXISTS(k) THEN GOTO 30
15 STORE(k,v)
20 RETURN(LOAD(k))
30 STORE(k,LOAD(k)+v)
35 RETURN LOAD(k)
End Function

Function ReturnTokens() Uint64
10 IF notEscrow() && notExpired THEN GOTO 90
20 RETURN returnTokens(LOAD("tokens"),STRLEN(LOAD("tokens")))
90 RETURN 1
End Function

Function returnTokens(tokens String, i Uint64) Uint64
10 IF i == 0 THEN GOTO 90
20 LET i= i-1
30 IF returnToken(SUBSTR(tokens,i*64,64)) THEN GOTO 10
90 RETURN 0
End Function

Function returnToken(token) Uint64
10 RETURN SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(LOAD("depositor:"+token)),LOAD("treasury:"+token),HEXDECODE(token))
End Function

Function payToken(token) Uint64
10 RETURN SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(LOAD("recipient:"+token)),LOAD("treasury:"+token),HEXDECODE(token))
End Function

Function Finalize() Uint64
10 IF notEscrow() && notExpired THEN GOTO 90
20 RETURN finalize(LOAD("tokens"),STRELEN(LOAD("tokens")))
90 RETURN 1
End Function

Function finalize(tokens String, i Uint64) Uint64
10 IF i == 0 THEN GOTO 90
20 LET i= i-1
30 IF payToken(SUBSTR(tokens,i*64,64)) THEN GOTO 10
90 RETURN 0
End Function

Function notExpired() Uint64
5 IF LOAD("autoFinalize") == 0 THEN GOTO 35
10 IF LOAD("CLOCK") == "HEIGHT" THEN GOTO 30
20 IF BLOCK_TIMESTAMP() > LOAD("END") THEN GOTO 90
25 RETURN 1
30 IF BLOCK_HEIGHT() > LOAD("END") THEN GOTO 90
35 RETURN 1
90 RETURN 0
End Function

Function notEscrow() Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("ESCROW"))) == 0 THEN GOTO 30
15 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("ESCROW")))
20 RETURN 0
30 RETURN 1
End Function

/* dispute function? or just message escrow agent
unianmous party finalization, or escrow-only?
pay escrow differently in different cases?
maybe keep it simple for now, can add more contract types down the line

*/
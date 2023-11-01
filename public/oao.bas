Function Initialize(name String,ceo String,http String, seats String, trustees String,board Uint64) Uint64
10 STORE("QUORUM",0)
20 STORE("CEO",ceo)
30 SEND_ASSET_TO_ADDRESS(SIGNER(),1,SCID())
40 STORE("0000000000000000000000000000000000000000000000000000000000000000","DERO")
50 STORE("treasury0000000000000000000000000000000000000000000000000000000000000000",0)
55 STORE("allowance0000000000000000000000000000000000000000000000000000000000000000",10)
60 STORE("OAO_VERSION","WEB")
65 STORE("DERO","0000000000000000000000000000000000000000000000000000000000000000")
70 STORE("OAO_NAME",name)
80 STORE("browserURL",http)
90 initBoard(seats,trustees, board)
99 RETURN 0
End Function

Function SetURL(type String, url String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
30 STORE(type+"URL",url)
99 RETURN 0
100 RETURN 1
End Function

Function add(key String, value Uint64) Uint64
10 IF EXISTS(key) THEN GOTO 20
11 RETURN STORE(key,value)
20 RETURN STORE(key,LOAD(key) + value)
End Function

Function Deposit(token String) Uint64
1 add("treasury"+token,ASSETVALUE(HEXDECODE(token)))
2 RETURN 0
End Function

Function Withdraw(amount Uint64, token String, special Uint64) Uint64
1 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 99
2 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
3 IF special ==1 THEN GOTO 20
4 IF amount > LOAD("treasury"+token) THEN GOTO 99
5 IF BLOCK_TIMESTAMP() < LOAD("allowanceRefresh"+token) THEN GOTO 8
6 STORE("allowanceRefresh"+token,BLOCK_TIMESTAMP()+LOAD("allowanceInterval"+token))
7 STORE("allowanceUsed"+token,0)
8 IF amount + LOAD("allowanceUsed"+token) > LOAD("allowance"+token) THEN GOTO 99
9 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,HEXDECODE(LOAD(token)))
10 STORE("allowanceUsed"+token,LOAD("allowanceUsed"+token)+amount)
11 STORE("treasury"+token,LOAD("treasury"+token)-amount)
19 RETURN 0
20 IF LOAD("allowanceSpecial"+token) > LOAD("treasury"+token) THEN GOTO 99
21 SEND_ASSET_TO_ADDRESS(SIGNER(),LOAD("allowanceSpecial"+token),HEXDECODE(LOAD(token)))
22 STORE("treasury"+token,LOAD("treasury"+token)-LOAD("allowanceSpecial"+token))
23 DELETE("allowanceSpecial"+token)
98 RETURN 0
99 RETURN 1
End Function

Function Propose(hash String, k String, v String, t String, seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 13
11 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
12 GOTO 15
13 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat))) !=1 THEN GOTO 100
14 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
15 STORE("APPROVE", 0)
20 IF hash =="" THEN GOTO 40
25 STORE("HASH",hash)
30 STORE("k","")
35 RETURN 0
40 STORE("k",k)
45 STORE("HASH","")
49 STORE("t",t)
80 STORE("v",v)
90 RETURN 0
100 RETURN 1
End Function

Function initBoard(seats String, trustees String, number Uint64) Uint64
10 LET number = number -1
20 STORE("trustee"+number,SUBSTR(trustees,66*number,66))
30 STORE("seat"+number,SUBSTR(seats,64*number,64))
40 IF number != 0 THEN GOTO 10
50 RETURN 0
End Function

Function Approve(seat Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("seat"+seat)))!=1 THEN GOTO 100
20 STORE("APPROVE",LOAD("APPROVE")+1)
30 STORE("trustee"+seat,ADDRESS_STRING(SIGNER()))
99 RETURN 0
100 RETURN 1
End Function

Function ClaimSeat(seat Uint64) Uint64
10 IF ADDRESS_STRING(SIGNER())!= LOAD("trustee"+seat) THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("seat"+seat)))
30 IF LOAD("APPROVE") == 0 THEN GOTO 99
40 STORE("APPROVE",LOAD("APPROVE")-1)
99 RETURN 0
100 RETURN 1
End Function

Function Update(code String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO")))!=1 THEN GOTO 100
15 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
20 IF SHA256(code) != HEXDECODE(LOAD("HASH")) THEN GOTO 100
30 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
40 UPDATE_SC_CODE(code)
99 RETURN 0
100 RETURN 1
End Function

Function Store() Uint64
10 IF LOAD("APPROVE") < LOAD("QUORUM") THEN GOTO 100
20 STORE("APPROVE",0)
30 IF LOAD("t") == "U" THEN GOTO 60
40 STORE(LOAD("k"), LOAD("v"))
45 STORE("k","")
50 RETURN 0
60 STORE(LOAD("k"),ATOI(LOAD("v")))
65 STORE("k","")
99 RETURN 0
100 RETURN 1
End Function
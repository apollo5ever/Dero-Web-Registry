Function Initialize(name String,ceo String,http String, seats String, trustees String,board Uint64,quorum Uint64) Uint64
//perhaps
1 add(ceo+seats+trustees+board+"/"+quorum,ASSETVALUE(SCID()))
2 IF EXISTS("CEO") && LOAD(ceo+seats+trustees+board+"/"+quorum)< 1000 THEN GOTO 99
10 STORE("QUORUM",quorum)
20 STORE("CEO",ceo)
30 SEND_ASSET_TO_ADDRESS(SIGNER(),1000,SCID())
35 add("circulatingSupply",1000-ASSETVALUE(SCID()))
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

Function SetDNSData(port Uint64, data String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
30 STORE(port,data)
40 RETURN 0
100 RETURN 1
End Function

Function SetDNSRoute(router Uint64, destination Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
30 STORE(router,destination)
40 RETURN 0
100 RETURN 1
End Function

//the idea with the above two functions:
//have a standard list of "ports" for data type and dapps
//ex: private islands checks port 6 (or if no such port goes to default 0) and is redirected to deroID stored at port 1
// every app has its own even numbered port, 0 is reserved for fall-back general port
// odd ports contain urls of various types, scids of various types, inscribed data 
//101,103,...999 could be standard for inscribed html
// extension first checks 2 which could point to 101

//maybe this is going off the rails but main innovation here is reset

Function Issue(amount Uint64) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("CEO"))) != 1 THEN GOTO 100
12 IF LOAD("issueAllowance") < amount THEN GOTO 100
14 STORE("issueAllowance",LOAD("issueAllowance")-amount)
20 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(LOAD("CEO")))
30 SEND_ASSET_TO_ADDRESS(SIGNER(),amount,SCID())
40 add("circulatingSupply",amount)
50 RETURN 0
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

Function Propose(k String, v String, t String, seat Uint64) Uint64
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
Function Initialize() Uint64
1 IF EXISTS("CEO") THEN GOTO 900
10 STORE("DNS","842363cc33439116ad02d20d36ddb5200efb11a05a6c34377557bc03003cedf4")
20 STORE(0,"owner:")
30 STORE(1,"key:")
40 STORE(2,"data:")
50 STORE(3,"datatype:")
60 STORE(4,"transferCost:")
70 STORE("QUORUM",0)
80 STORE("CEO","a2cb17a6f12f590d452974a0b162dfed71590bf0c9c8b594e0605ea2d7154b8a")
90 STORE("treasury"+HEX(DERO()),0)
100 STORE("OAO_VERSION","PI")
110 STORE("OAO_NAME","DERO WEB")
120 STORE("APPROVE",0)
200 RETURN 0
900 RETURN 1
End Function

Function Register(name String, key String, owner String, transferCost Uint64, data String, datatype String) Uint64
10 IF notAvailable(name) THEN GOTO 100
20 STORE("owner:"+name,owner)
21 STORE("key:"+name,key)
22 STORE("data:"+name,data)
23 STORE("datatype:"+name,datatype)
24 STORE("transferCost:"+name,transferCost)
99 RETURN 0
100 RETURN 1
End Function

Function Renew(name String) Uint64
10 RETURN extendExpiry(name,0)
End Function

Function ChangeKey(name String, scid String, address String, cost Uint64) Uint64
5 IF ASSETVALUE(HEXDECODE(LOAD("key:"+name))) == 0 THEN GOTO 50
10 add("activeTransfer:"+name+":"+scid+":"+address+":"+cost,ASSETVALUE(HEXDECODE(LOAD("key:"+name))))
20 IF LOAD("activeTransfer:"+name+":"+scid+":"+address+":"+cost) < LOAD("transferCost:"+name) THEN GOTO 40
30 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(address),LOAD("transferCost:"+name),HEXDECODE(LOAD("key:"+name)))
35 DELETE("activeTransfer:"+name+":"+scid+":"+address+":"+cost)
36 STORE("key:"+name,scid)
37 STORE("transferCost:"+name,cost)
40 RETURN 0
50 RETURN 1
End Function

Function OwnerStore(name String, k Uint64, v String) Uint64
10 IF ADDRESS_STRING(SIGNER()) ! = LOAD("owner:"+name) THEN GOTO 100
20 STORE(LOAD(k)+name,v)
90 RETURN 0
100 RETURN 1
End Function

Function ChangeData(name String, data String, datatype String, address String) Uint64
10 IF ASSETVALUE(HEXDECODE(LOAD("key:"+name))) != 1 THEN GOTO 100
20 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(address),1,HEXDECODE(LOAD("key:"+name)))
30 STORE("data:"+name,data)
40 STORE("datatype:"+name,datatype)
99 RETURN 0
100 RETURN 1
End Function

Function NewOwner(name String, owner String) Uint64
5 IF ASSETVALUE(HEXDECODE(LOAD("key:"+name))) == 0 THEN GOTO 50
10 add("activeTransfer:"+name+":"+owner, ASSETVALUE(HEXDECODE(LOAD("key:"+name))))
20 IF LOAD("activeTransfer:"+name+":"+owner) < LOAD("transferCost:"+name) THEN GOTO 40
25 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(owner),LOAD("transferCost:"+name),HEXDECODE(LOAD("key:"+name)))
30 STORE("owner:"+name,owner)
35 DELETE("activeTransfer:"+name+":"+owner)
40 RETURN 0
50 RETURN 1
End Function

Function add(k String, v Uint64) Uint64
10 IF EXISTS(k) THEN GOTO 30
15 STORE(k,v)
20 RETURN(LOAD(k))
30 STORE(k,LOAD(k)+v)
35 RETURN LOAD(k)
End Function

Function notAvailable(name String) Uint64
10 IF EXISTS("key:"+name) == 0 THEN GOTO 90
20 IF LOAD("expiry:"+name) > BLOCK_TIMESTAMP() THEN GOTO 100
90 RETURN extendExpiry(name,1)
100 RETURN 1
End Function

Function extendExpiry(name String, fresh Uint64) Uint64
2 DIM dero, dns as Uint64
4 LET dero = DEROVALUE()
6 LET dns = ASSETVALUE(HEXDECODE(LOAD("DNS")))
8 add("treasury"+HEX(DERO()),dero)
9 add("treasury"+LOAD("DNS"),dns)
10 add("expiry:"+name,ASSETVALUE(HEXDECODE(LOAD("DNS")))*315576+BLOCK_TIMESTAMP()*fresh)
11 RETURN 0
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
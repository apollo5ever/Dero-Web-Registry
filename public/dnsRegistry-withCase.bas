Function Initialize() Uint64
1 IF EXISTS("CEO") THEN GOTO 900
10 STORE("DNS","ee404fc1b2e271a5531c42c30dd6e22379a60aadc4391acdbe3a2723369b3bfc")
20 STORE(0,"owner:")
30 STORE(1,"key:")
40 STORE(2,"data:")
50 STORE(3,"datatype:")
60 STORE(4,"transferCost:")
70 STORE("QUORUM",0)
80 STORE("CEO","f9bf56d2356832d7c79d93fdb0658e1fd1f1f74acf2b1f0227fbf76a115958e6")
90 STORE("treasury"+HEX(DERO()),0)
100 STORE("OAO_VERSION","PI")
110 STORE("OAO_NAME","DERO WEB")
120 STORE("APPROVE",0)
200 RETURN 0
900 RETURN 1
End Function

Function Register(name String, key String, owner String, transferCost Uint64, data String, datatype String) Uint64
5 LET name = toLowerCase(name)
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

Function toLowerCase(name String) String
10 DIM i,n as Uint64
15 DIM newName as String
20 LET n = STRLEN(name)
30 IF i == n THEN GOTO 100
40 LET newName = newName + toLowerChar(SUBSTR(name,i,1))
50 LET i = i + 1
60 GOTO 30
100 RETURN newName
End Function

Function toLowerChar(char String) String
10 IF char == "A" THEN GOTO 110
20 IF char == "B" THEN GOTO 120
30 IF char == "C" THEN GOTO 130
40 IF char == "D" THEN GOTO 140
50 IF char == "E" THEN GOTO 150
60 IF char == "F" THEN GOTO 160
70 IF char == "G" THEN GOTO 170
80 IF char == "H" THEN GOTO 180
90 IF char == "I" THEN GOTO 190
91 IF char == "J" THEN GOTO 200
92 IF char == "K" THEN GOTO 210
93 IF char == "L" THEN GOTO 220
94 IF char == "M" THEN GOTO 230
95 IF char == "N" THEN GOTO 240
96 IF char == "O" THEN GOTO 250
97 IF char == "P" THEN GOTO 260
98 IF char == "Q" THEN GOTO 270
99 IF char == "R" THEN GOTO 280
100 IF char == "S" THEN GOTO 290
101 IF char == "T" THEN GOTO 300
102 IF char == "U" THEN GOTO 310
103 IF char == "V" THEN GOTO 320
104 IF char == "W" THEN GOTO 330
105 IF char == "X" THEN GOTO 340
106 IF char == "Y" THEN GOTO 350
107 IF char == "Z" THEN GOTO 360
108 RETURN char
110 RETURN "a"
120 RETURN "b"
130 RETURN "c"
140 RETURN "d"
150 RETURN "e"
160 RETURN "f"
170 RETURN "g"
180 RETURN "h"
190 RETURN "i"
200 RETURN "j"
210 RETURN "k"
220 RETURN "l"
230 RETURN "m"
240 RETURN "n"
250 RETURN "o"
260 RETURN "p"
270 RETURN "q"
280 RETURN "r"
290 RETURN "s"
300 RETURN "t"
310 RETURN "u"
320 RETURN "v"
330 RETURN "w"
340 RETURN "x"
350 RETURN "y"
360 RETURN "z"
End Function

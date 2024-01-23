Function Initialize() Uint64
10 IF EXISTS("CEO") THEN GOTO 100
20 STORE("CEO","a9a18010f3b52083d6cb040d9003656386c1a96a547c1d136052c1e239040dea")
30 STORE("TICKETS",0)
31 STORE("TICKET_PRICE",1000000)
40 STORE("nextDraw"+HEX(DERO()),BLOCK_TIMESTAMP())
45 STORE("DNS","c75a2fe3a8a00dab1931e7cf9c0077a5e2a9bfb0516abde4b88d58c8dccf86f1")
60 STORE("LOTTO-INTERVAL",2419200)
70 STORE("APPROVE",0)
80 STORE("QUORUM",0)
99 RETURN 0
100 RETURN 1
End Function

Function Draw(token String) Uint64
12 IF BLOCK_TIMESTAMP() < LOAD("nextDraw"+token) THEN GOTO 100
20 dim winner as Uint64
21 LET winner = RANDOM(LOAD("TICKETS"))
22 IF EXISTS("TICKET_"+winner) == 0 THEN GOTO 21
23 STORE("WINNING TICKET",winner)
40 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(LOAD("TICKET_"+winner)),LOAD("treasury"+token),HEXDECODE(token))
41 STORE("treasury"+token,0)
42 add("nextDraw"+token,LOAD("LOTTO-INTERVAL"))
99 RETURN 0
100 RETURN 1
End Function

Function BuyTickets() Uint64
10 dim t,n,amount,price as Uint64
15 LET price = LOAD("TICKET_PRICE")
20 LET amount = ASSETVALUE(HEXDECODE(LOAD("DNS")))/price
30 LET t = LOAD("TICKETS")
40 LET n = t + amount
50 IF n == t THEN GOTO 70
60 STORE("TICKET_"+t, ADDRESS_STRING(SIGNER()))
61 LET t = t +1
62 GOTO 50
70 STORE("TICKETS",n)
80 add(ADDRESS_STRING(SIGNER())+"_DNS",amount*price)
85 add(ADDRESS_STRING(SIGNER())+"_TICKETS",amount)
99 RETURN 0
100 RETURN 1
End Function

Function RedeemDNS(ticket String) Uint64
10 dim i,n,t as Uint64
20 LET n = STRLEN(ticket)/6
30 LET i = 0
40 IF i == n THEN GOTO 80
50 LET t = ATOI(SUBSTR(ticket,6*i,6))
51 IF LOAD("TICKET_"+t) != ADDRESS_STRING(SIGNER()) THEN GOTO 100
52 DELETE("TICKET_"+t)
60 LET i = i +1
70 GOTO 40
80 SEND_ASSET_TO_ADDRESS(SIGNER(),LOAD(ADDRESS_STRING(SIGNER())+"_DNS")*n/LOAD(ADDRESS_STRING(SIGNER())+"_TICKETS"),HEXDECODE(LOAD("DNS")))
95 STORE(ADDRESS_STRING(SIGNER())+"_DNS",LOAD(ADDRESS_STRING(SIGNER())+"_DNS")-LOAD(ADDRESS_STRING(SIGNER())+"_DNS")*n/LOAD(ADDRESS_STRING(SIGNER())+"_TICKETS"))
96 STORE(ADDRESS_STRING(SIGNER())+"_TICKETS",LOAD(ADDRESS_STRING(SIGNER())+"_TICKETS")-n)
99 RETURN 0
100 RETURN 1
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

Function Deposit(token String) Uint64
1 add("treasury"+token,ASSETVALUE(HEXDECODE(token)))
2 add("nextDraw"+token,0)
3 RETURN 0
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

Function add(key String, value Uint64) Uint64
10 IF EXISTS(key) THEN GOTO 20
11 RETURN STORE(key,value)
20 RETURN STORE(key,LOAD(key) + value)
End Function
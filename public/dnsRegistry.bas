Function Initialize() Uint64
10 STORE("DNS","94f68877bf389263f39036d01d1975fedc63082262860c5a1324b7d39b9a2ccf")
20 STORE(0,"owner:")
30 STORE(1,"key:")
40 STORE(2,"data:")
50 STORE(3,"datatype:")
60 STORE(4,"transferCost:")
90 RETURN 0
100 RETURN 1
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

Function ChangeKey(name String, scid String, address String) Uint64
10 add("activeTransfer:"+name+":"+scid,ASSETVALUE(HEXDECODE(LOAD("key:"+name))))
20 IF LOAD("activeTransfer:"+name+":"+scid) < LOAD("transferCost:"+name) THEN GOTO 40
30 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(address),LOAD("transferCost:"+name),HEXDECODE(LOAD("key:"+name)))
35 DELETE("activeTransfer:"+name+":"+scid)
36 STORE("key:"+name,scid)
40 RETURN 0
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
10 add("activeTransfer:"+name+":"+owner, ASSETVALUE(HEXDECODE(LOAD("key:"+name))))
20 IF LOAD("activeTransfer:"+name+":"+owner) < LOAD("transferCost:"+name) THEN GOTO 40
25 SEND_ASSET_TO_ADDRESS(ADDRESS_RAW(owner),LOAD("transferCost:"+name),HEXDECODE(LOAD("key:"+name)))
30 STORE("owner:"+name,owner)
35 DELETE("activeTransfer:"+name+":"+owner)
40 RETURN 0
End Function

Function add(k String, v Uint64) Uint64
10 IF EXISTS(k) THEN GOTO 30
15 STORE(k,v)
20 RETURN(LOAD(k))
30 STORE(k,LOAD(k)+v)
35 RETURN LOAD(k)
End Function

Function notAvailable(name String) Uint64
10 IF EXISTS("key:"+name) == 0 THEN GOTO 90 //name available return 0
20 IF LOAD("expiry:"+name) > BLOCK_TIMESTAMP() THEN GOTO 100 // name not available return 1
90 RETURN extendExpiry(name,1)
100 RETURN 1
//100 SEND_ASSET_TO_ADDRESS(SIGNER(),ASSETVALUE(HEXDECODE(LOAD("DNS"))),HEXDECODE(LOAD("DNS")))
//110 SEND_DERO_TO_ADDRESS(SIGNER(),DEROVALUE())
End Function

Function extendExpiry(name String, fresh Uint64) Uint64
2 DIM dero, dns as Uint64
4 LET dero = DEROVALUE()
6 LET dns = ASSETVALUE(HEXDECODE(LOAD("DNS")))
8 add("treasury"+HEX(DERO()),dero)
9 add("treasury"+LOAD("DNS"),dns)
10 add("expiry:"+name,DEROVALUE()*16+ASSETVALUE(HEXDECODE(LOAD("DNS")))*315576000+BLOCK_TIMESTAMP()*fresh)
11 RETURN 0
End Function

/* owner:name   (address with permission to modify)
key:name     (token with permission to modify)
data:name    (what name points to)
datatype:name  (how name is pointed to data)


scenario:

I register deroID as both key and data for the name apollo. I register my address as the owner.
datatype is deroID?
I can use my wallet to update owner, key, data, datatype
I can use deroID to update owner, key, data, datatype

for example, I could use wallet to transfer name to a basic name token that I control, and set owner to null. then I could sell basic name token and owner could set their own address as owner
and they could transfer to an oao for example

oao scenario:
I register nameOAO with name privateislands
I hold a ceo token which allows me to updata data
I register no address as owner
I register nameOAO contract scid as data
I register datatype as nameOAO?
I register key as nameOAO scid? 1000?

in order for oao to sell domain name to another oao it can put 1000 reset tokens in a sale contract. buyer puts funds in contract. trade is executed. can have withdrawl token for oao withdrawl
new oao can also use withdrawl token to get reset token


SCENARIO:
selling derbnb.dns

nameOAO controled by team A 
ceo A withdraws reset tokens 100 at a time and deposits into sale contract
ceo B withdraws funds and deposits into sale contract
ceo A withdraws withdrawl tokens A with which to withdraw funds
ceo B withdraws withdrawl tokens B with which to withdraw reset tokens
ceo A deposits funds into treasury
ceo B deposits reset tokens in registry? or simply into nameOAO?  */

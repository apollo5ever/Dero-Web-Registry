Function Initialize() Uint64
10 RETURN 0
End Function

Function RatePublic(obj String, rating Uint64, ratingType String, comment String, token String) Uint64
1 IF token =="" THEN GOTO 10
2 IF ASSETVALUE(HEXDECODE(token)) == 0 THEN GOTO 10
3 STORE(format("rating",obj,token,"comment"),rating)
4 STORE(format("rating",obj,token,"comment"),comment)
5 SEND_ASSET_TO_ADDRESS(SIGNER(),ASSETVALUE(HEXDECODE(token)),HEXDECODE(token))
6 RETURN 0
10 STORE(format("rating",obj,ADDRESS_STRING(SIGNER()),ratingType),rating)
20 STORE(format("rating",obj,ADDRESS_STRING(SIGNER()),"comment"),comment)
90 RETURN 0
End Function

Function RatePrivate(obj String, rating Uint64, ratingType String, comment String) Uint64
10 STORE(format("rating",obj,"ANON",ratingType),rating)
20 STORE(format("rating",obj,"ANON","comment"),comment)
90 RETURN 0
End Function

Function format(A String, B String, C String, D String) String
10 RETURN A+":"+B+":"+C+":"+D
End Function

/*
rating:object:subject:type,score
interactionStatus:A:B:time,status
interactionRating:object:subject:time,score
*/



Function RateInteraction(A String, B String, time Uint64,rating Uint64, ratingType String, comment String) Uint64
10 IF EXISTS(format("status",A,B,time)) THEN GOTO 20
15 RETURN 1
20 IF notOwner(A) THEN GOTO 40
30 STORE(format("iRating",B,A,time),rating)
35 RETURN 0
40 IF notOwner(B) THEN GOTO 15
45 STORE(format("iRating",A,B,time),rating)
50 RETURN 0
End Function
//another idea how about keep it simple with public rating function
// but if both parties agree then add something like
// STORE(B+A,timestamp)
// so there is a record that the two have an interaction and ui can take that into account
Function VerifyAssociation(A String, B String) Uint64
10 IF notOwner(A) THEN GOTO 100
20 STORE(A+B,1)
90 RETURN 0
100 RETURN 1
End Function

Function RenounceAssociation(A String, B String) Uint64
10 IF notOwner(A) THEN GOTO 100
20 IF EXISTS(B+A) THEN GOTO 100
30 DELETE(A+B)
90 RETURN 0
100 RETURN 1
End Function

Function NewInteraction(A String, B String) Uint64
1 IF notOwner(A) THEN GOTO 100
10 STORE("status:"+A+":"+B+":"+BLOCK_TIMESTAMP(),"proposal")
90 RETURN 0
100 RETURN 1
End Function

Function ConfirmInteraction(A String, B String, time Uint64) Uint64
10 IF EXISTS("status:"+A+":"+B+time) THEN GOTO 20
15 RETURN 1
20 IF notOwner(B) THEN GOTO 15
30 STORE("status:"+A+":"+B+time,"active")
35 RETURN 0
End Function

Function notOwner(obj String) Uint64
10 IF STRLEN(obj) == 66 THEN GOTO 40
20 IF ASSETVALUE(HEXDECODE(obj)) == 0 THEN GOTO 100
25 SEND_ASSET_TO_ADDRESS(SIGNER(),1,HEXDECODE(obj))
30 RETURN 0
40 IF ADDRESS_RAW(obj) != SIGNER() THEN GOTO 100
50 RETURN 0
100 RETURN 1
End Function





/*trust filter on ui
special badge for profiles I trust at least 8
special badge for profiles trusted at least 8 by those I trust at least 8
and so on
can be adjusted in settings
*/
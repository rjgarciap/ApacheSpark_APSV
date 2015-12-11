import sys,re,operator
with open(sys.argv[1]) as lines:
 wordcount={}
 for word in re.findall('\w+',lines.read().lower()):
    if word not in wordcount:
        wordcount[word] = 1
    else:
        wordcount[word] += 1
 wordcount=sorted(wordcount.items(), key=operator.itemgetter(1),reverse=True)
 with open("./data.json", "w") as text_file:
  json = "{\"name\":\"hashtag\",\"children\":["      
  for word,count in wordcount:
     json+="\n{\"name\":\""+word+"\",\"size\":"+str(count)+"},"
  json=json[0:len(json)-1]
  text_file.write(json)
  json = "\n]}"
  text_file.write(json)
  text_file.close()
import sys
with open(sys.argv[1]) as lines:
 wordcount={}
 for word in lines.read().split():
    if word not in wordcount:
        wordcount[word] = 1
    else:
        wordcount[word] += 1
 with open("Output.txt", "w") as text_file:       
  for k,v in wordcount.items():
     text=k+","+str(v)+"\n"
     text_file.write(text)
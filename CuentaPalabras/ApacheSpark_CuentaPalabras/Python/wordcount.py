import sys,string,re
from operator import add

from pyspark import SparkContext

if __name__ == "__main__":
    if len(sys.argv) != 2:
        exit(-1)
    sc = SparkContext(appName="PythonWordCount")
    lines = sc.textFile(sys.argv[1], 1)
    counts = lines.flatMap(lambda line: re.split(r'\W*', line.rstrip())) \
         .filter(lambda word: word!="\n" or str(word.lower())!="the") \
         .map(lambda word: (word.lower(), 1)) \
         .reduceByKey(lambda a, b: a + b) \
         .map(lambda (a,b): (b, a)) \
         .sortByKey(False)
    output = counts.collect()
    with open("./d3sunburst/dataspark.json", "w") as text_file: 
     json = "{\"name\":\"hashtag\",\"children\":["
     for (count, word) in output:
      json+="\n{\"name\":\""+word+"\",\"size\":"+str(count)+"},"
     json=json[0:len(json)-1]
     text_file.write(json)
     json = "\n]}"
     text_file.write(json)
     text_file.close()
    sc.stop()

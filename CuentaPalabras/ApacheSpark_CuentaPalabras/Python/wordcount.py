import sys,string
from operator import add

from pyspark import SparkContext

if __name__ == "__main__":
    if len(sys.argv) != 2:
        exit(-1)
    sc = SparkContext(appName="PythonWordCount")
    lines = sc.textFile(sys.argv[1], 1)
    counts = lines.flatMap(lambda x: x.split(' ')) \
                  .map(lambda x: (x, 1)) \
                  .reduceByKey(add)
    output = counts.collect()
    with open("./data.json", "w") as text_file: 
     json = "{\"name\":\"hashtag\",\"children\":["
     text_file.write(json)
     for (word, count) in output:
      json="\n{\"name\":\""+word+"\",\"size\":"+str(count)+"},"
      text_file.write(json)
     json = "\n]}"
     text_file.write(json)
     text_file.close()

    sc.stop()
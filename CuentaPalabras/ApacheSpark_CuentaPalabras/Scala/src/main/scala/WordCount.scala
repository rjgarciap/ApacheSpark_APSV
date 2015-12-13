import scala.io.Source
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import scala.util.matching.Regex
import java.io._

object WordCount {
    def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("wordCount")
    /** Create the SparkContext */
    val sc = new SparkContext(conf)
    val file = sc.textFile(args(0))
    val words = file.flatMap(line => tokenize(line))
    val wordCounts = words.map(x => (x, 1)).reduceByKey(_ + _)
    val wordCountsOrdered = wordCounts.map { case(word, count) => (count, word) }
                         .sortByKey(false).take(10)
    //wordCountsOrdered.take(10).saveAsTextFile(args(1))
    var json = ""
    for(tuple <- wordCountsOrdered){
      json+="Clave:"+tuple._1+"Valor:"+tuple._2
      print(json)
    }
  //val writer = new PrintWriter(new File(".//data.json" ))
    //  writer.write(json)
     // writer.close()
  }

  // Split a piece of text into individual words.
  private def tokenize(text : String) : Array[String] = {
    // Lowercase each word and remove punctuation.
    var words = text.toLowerCase.split("\\s+")
    val pattern = "[A-Za-z0-9]+".r
    //val pattern = "[A-Za-z0-9]+".r
    for(i <- 0 until words.length-1){
      words(i) = (pattern findFirstIn words(i)).getOrElse("")
      print(words(i))
    }
    words
  }
}

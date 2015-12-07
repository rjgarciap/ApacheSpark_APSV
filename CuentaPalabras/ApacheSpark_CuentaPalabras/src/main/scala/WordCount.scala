import scala.io.Source
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf

object WordCount {
    def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("wordCount")
    /** Create the SparkContext */
    val sc = new SparkContext(conf)
    // Adapted from Word Count example on http://spark-project.org/examples/
    val file = sc.textFile(args(0))
    val words = file.flatMap(line => tokenize(line))
    val wordCounts = words.map(x => (x, 1)).reduceByKey(_ + _)
    wordCounts.saveAsTextFile(args(1))
  }

  // Split a piece of text into individual words.
  private def tokenize(text : String) : Array[String] = {
    // Lowercase each word and remove punctuation.
    text.toLowerCase.split("\\s+")
  }
}
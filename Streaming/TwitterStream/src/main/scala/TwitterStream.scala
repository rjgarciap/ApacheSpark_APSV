import org.apache.spark._
import org.apache.spark.SparkContext._
import org.apache.spark.streaming._
import org.apache.spark.streaming.twitter._
import org.apache.spark.streaming.StreamingContext._
import scala.collection.mutable.HashMap
import org.json4s._
import org.json4s.native.JsonMethods._
import java.io._

object TwitterStream {
  def main(args: Array[String]) {

    //Twitter credentials
    val apiKey = "02Cge8Y55ODfYZydLLRUrm3By"
    val apiSecret ="IF0DwQP7uCABl0c1RD0JS3dYpwoJ35X32KAdg9YRbcqVzfwngd"
    val accessToken ="215737253-BjvNZzBQlFFF8O1pkbXFx1JJiomoVyozAJWKcGdY"
    val accessTokenSecret ="hcxy5XxMjaeRFeJHIP1BgObMCAiwDoVQNhndAWrjAtOjY"
    configureTwitterCredentials(apiKey, apiSecret, accessToken, accessTokenSecret)
   
    //Processing
    val sc = new SparkConf().setAppName("TwitterStream").setMaster("local[4]")
    val ssc = new StreamingContext(sc, Seconds(1))
    val tweets = TwitterUtils.createStream(ssc, None)
    val statuses = tweets.map(status => status.getText())
    val words = statuses.flatMap(status => status.split(" "))
    val hashtags = words.filter(word => word.startsWith("#"))

    val counts = hashtags.map(tag => (tag, 1))
                     .reduceByKeyAndWindow(_ + _, _ - _, Seconds(60 * 5), Seconds(1))

    val sortedCounts = counts.map { case(tag, count) => (count, tag) }
                         .transform(rdd => rdd.sortByKey(false))


    //Creating JSON with the 10 Hashtags more tweeted
    sortedCounts.foreachRDD( rdd => {
          val writer = new PrintWriter(new File("./d3bubbles/data.json" ))
      println("\nNew Data")
      var json = "{\"name\":\"hashtag\",\n\"children\": ["
      var withData = false
      for(item <- rdd.take(10).toArray) {
          if(!withData){
            withData = true
          }
          json+="\n{\"name\":\""+ item._2 +"\",\"size\":"+ item._1 +"},"
      }
      if(withData){
        json = json.substring(0,json.length()-1)
      }
      json += "\n]}"
      writer.write(json)
      writer.close()
      print(json)
    })

   

    ssc.checkpoint("/tmp/")
    ssc.start()
    ssc.awaitTermination()
  }

 def configureTwitterCredentials(apiKey: String, apiSecret: String, accessToken: String, accessTokenSecret: String) {
    val configs = new HashMap[String, String] ++= Seq(
      "apiKey" -> apiKey, "apiSecret" -> apiSecret, "accessToken" -> accessToken, "accessTokenSecret" -> accessTokenSecret)
    println("Configuring Twitter OAuth")
    configs.foreach{ case(key, value) => 
        if (value.trim.isEmpty) {
          throw new Exception("Error setting authentication - value for " + key + " not set")
        }
        val fullKey = "twitter4j.oauth." + key.replace("api", "consumer")
        System.setProperty(fullKey, value.trim)
        println("\tProperty " + fullKey + " set as [" + value.trim + "]") 
    }
    println()
  }
}


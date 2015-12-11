//
// Programmatically Specifying the Schema
//

// Create SQLContext from the existing SparkContext.
val sqlContext = new org.apache.spark.sql.SQLContext(sc)

// Create an RDD
val rddCustomers = sc.textFile("/Users/jorgeramirezcarrasco/Desktop/sql/customers.txt")

// The schema is encoded in a string
val schemaString = "customer_id name city state zip_code"

// Import Spark SQL data types and Row.
import org.apache.spark.sql._

import org.apache.spark.sql.types._;

// Generate the schema based on the string of schema
val schema = StructType(schemaString.split(" ").map(fieldName => StructField(fieldName, StringType, true)))

// Convert records of the RDD (rddCustomers) to Rows.
val rowRDD = rddCustomers.map(_.split(",")).map(p => Row(p(0).trim,p(1),p(2),p(3),p(4)))

// Apply the schema to the RDD.
val dfCustomers = sqlContext.createDataFrame(rowRDD, schema)

// Register the DataFrames as a table.
dfCustomers.registerTempTable("customers")

// SQL statements can be run by using the sql methods provided by sqlContext.
val custNames = sqlContext.sql("SELECT name FROM customers")

// The results of SQL queries are DataFrames and support all the normal RDD operations.
// The columns of a row in the result can be accessed by ordinal.
custNames.map(t => "Name: " + t(0)).collect().foreach(println)

// SQL statements can be run by using the sql methods provided by sqlContext.
val customersByCity = sqlContext.sql("SELECT name,zip_code FROM customers ORDER BY zip_code")

// The results of SQL queries are DataFrames and support all the normal RDD operations.
// The columns of a row in the result can be accessed by ordinal.
customersByCity.map(t => t(0) + "," + t(1)).collect().foreach(println)
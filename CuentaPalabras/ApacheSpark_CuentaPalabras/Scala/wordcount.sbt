name := "Simple Project"

version := "1.0"

scalaVersion := "2.10.4"

libraryDependencies += "org.apache.spark" %% "spark-core" % "1.2.0"

mainClass in (Compile, packageBin) := Some("WordCount")

mainClass in (Compile, run) := Some("WordCount")

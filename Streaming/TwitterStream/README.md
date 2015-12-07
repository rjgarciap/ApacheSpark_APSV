#TwitterSteam

Para ejecutar este ejemplo:

${SPARK_DIR}/spark-submit  --class "com.databricks.apps.twitter_classifier.Collect"      --master local[4]      target/scala-2.10/simple-project_2.10-1.0.jar      /tmp/tweets      10000      10      1      --consumerKey 02Cge8Y55ODfYZydLLRUrm3By      --consumerSecret IF0DwQP7uCABl0c1RD0JS3dYpwoJ35X32KAdg9YRbcqVzfwngd      --accessToken  215737253-BjvNZzBQlFFF8O1pkbXFx1JJiomoVyozAJWKcGdY       --accessTokenSecret  hcxy5XxMjaeRFeJHIP1BgObMCAiwDoVQNhndAWrjAtOjY


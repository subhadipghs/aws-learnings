## Lambda layers

[Video Link](https://www.youtube.com/watch?v=i12H4cUFudU)

1. Create a layer directory
2. Add `nodejs` folder to it
3. Run `npm init -y` to initialize the directory
4. Create custom file if you want. It should be on the `nodejs` folder.
5. Zip the layer directory and create a layer using Management console or using sdk.
5. You can import the file using `/opt/<file>` in your Lambda functions

In this example I've created a simple `date` layer which is exporting using moment library. In the actual lambda function we can import it using `/opt/date` 

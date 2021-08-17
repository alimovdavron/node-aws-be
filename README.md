## Links to the Lambdas:

* getProductList: https://ki4323apmh.execute-api.eu-central-1.amazonaws.com/dev/products/
* getProductsById: https://ki4323apmh.execute-api.eu-central-1.amazonaws.com/dev/products/{productId}

## Link to the CloudFront Distribution

https://d1s4qelxm95ilt.cloudfront.net/

## Additional tasks

* [Swagger file](/product-service/swagger.yml)
* [Webpack configuration file](/product-service/webpack.config.js)
* [Unit tests](/product-service/src/__tests__)
* [getProductsList Module](/product-service/src/functions/getProductsList)
* [getProductsById Module](/product-service/src/functions/getProductsById)
* [Error handler middleware](/product-service/src/libs/errorHandlerMiddleware.ts)

### Examples

* [Validation Error](https://ki4323apmh.execute-api.eu-central-1.amazonaws.com/dev/products/asdfa)
* [No such id Error](https://ki4323apmh.execute-api.eu-central-1.amazonaws.com/dev/products/c91bc7a1-de15-4837-8a19-8cf27758a15e)


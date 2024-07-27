import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";

class BlueListsDataStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
    });
    const bucket = new s3.Bucket(this, "BlueListsDataBucket", {
      bucketName: "blue-amsterdam-lists-data",
      publicReadAccess: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const bucketPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [bucket.arnForObjects("*")],
      principals: [new iam.AnyPrincipal()], // Grants access to everyone
    });
    bucket.addToResourcePolicy(bucketPolicy);
    new cdk.CfnOutput(this, "BlueListsDataBucketArn", {
      value: bucket.bucketArn,
      exportName: "BlueListsDataBucketArn",
    });
    new cdk.CfnOutput(this, "BlueListsDataBucketName", {
      value: bucket.bucketName,
      exportName: "BlueListsDataBucketName",
    });
  }
}

class BlueListsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
    });
    const bucketArn = cdk.Fn.importValue("BlueListsDataBucketArn");
    const bucketName = cdk.Fn.importValue("BlueListsDataBucketName");

    const role = new iam.Role(this, "BlueListsApiExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole",
        ),
      ],
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["lambda:InvokeFunction"],
        resources: ["*"],
      }),
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:*"],
        resources: [bucketArn + "/*", bucketArn],
      }),
    );

    const listsLambda = new lambda.Function(this, "BlueListsApiLists", {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: role,
      handler: "views.allListsHandler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset("src", {
        exclude: ["*.ts", "node_modules/aws-sdk-lib", "test/", "README.md"],
      }),
      logRetention: logs.RetentionDays.THREE_DAYS,
      environment: {
        BUCKET_NAME: bucketName,
        GOOGLE_CLIENT_ID: "abc",
        TEST_CLIENT_ID: "abc",
        TEST_EMAIL: "blue@putazo.com",
      },
    });

    const listLambda = new lambda.Function(this, "BlueListsApiList", {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: role,
      handler: "views.oneListHandler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset("src", {
        exclude: ["*.ts", "node_modules/aws-sdk-lib", "test/", "README.md"],
      }),
      logRetention: logs.RetentionDays.THREE_DAYS,
      environment: {
        BUCKET_NAME: bucketName,
        GOOGLE_CLIENT_ID: "abc",
        TEST_CLIENT_ID: "abc",
        TEST_EMAIL: "blue@putazo.com",
      },
    });

    const itemsLambda = new lambda.Function(this, "BlueListsApiItems", {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: role,
      handler: "views.allItemsHandler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset("src", {
        exclude: ["*.ts", "node_modules/aws-sdk-lib", "test/", "README.md"],
      }),
      logRetention: logs.RetentionDays.THREE_DAYS,
      environment: {
        BUCKET_NAME: bucketName,
        GOOGLE_CLIENT_ID: "abc",
        TEST_CLIENT_ID: "abc",
        TEST_EMAIL: "blue@putazo.com",
      },
    });

    const membersLambda = new lambda.Function(this, "BlueListsApiMembers", {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: role,
      handler: "views.allMembersHandler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset("src", {
        exclude: ["*.ts", "node_modules/aws-sdk-lib", "test/", "README.md"],
      }),
      logRetention: logs.RetentionDays.THREE_DAYS,
      environment: {
        BUCKET_NAME: bucketName,
        GOOGLE_CLIENT_ID: "abc",
        TEST_CLIENT_ID: "abc",
        TEST_EMAIL: "blue@putazo.com",
      },
    });

    const memberLambda = new lambda.Function(this, "BlueListsApiMember", {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: role,
      handler: "views.oneMemberHandler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      code: lambda.Code.fromAsset("src", {
        exclude: ["*.ts", "node_modules/aws-sdk-lib", "test/", "README.md"],
      }),
      logRetention: logs.RetentionDays.THREE_DAYS,
      environment: {
        BUCKET_NAME: bucketName,
        GOOGLE_CLIENT_ID: "abc",
        TEST_CLIENT_ID: "abc",
        TEST_EMAIL: "blue@putazo.com",
      },
    });

    const api = new apigateway.LambdaRestApi(this, "BlueListsApi", {
      restApiName: "BlueListsApi",
      handler: listsLambda,
      proxy: false,
    });

    const v1 = api.root.addResource("v1");
    const allListsEndpoint = v1.addResource("lists");
    const oneListEndpoint = allListsEndpoint.addResource("{listId}");
    const allItemsEndpoint = oneListEndpoint.addResource("items");
    const allMembersEndpoint = oneListEndpoint.addResource("users");
    const oneMemberEndpoint = allMembersEndpoint.addResource("{userId}");

    allListsEndpoint.addMethod(
      "GET",
      new apigateway.LambdaIntegration(listsLambda),
      {},
    );
    allListsEndpoint.addMethod(
      "POST",
      new apigateway.LambdaIntegration(listsLambda),
      {},
    );
    allListsEndpoint.addMethod(
      "OPTIONS",
      new apigateway.LambdaIntegration(listsLambda),
      {},
    );

    oneListEndpoint.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(listLambda),
      {},
    );
    oneListEndpoint.addMethod(
      "OPTIONS",
      new apigateway.LambdaIntegration(listLambda),
      {},
    );

    allItemsEndpoint.addMethod(
      "GET",
      new apigateway.LambdaIntegration(itemsLambda),
      {},
    );
    allItemsEndpoint.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(itemsLambda),
      {},
    );
    allItemsEndpoint.addMethod(
      "OPTIONS",
      new apigateway.LambdaIntegration(itemsLambda),
      {},
    );

    allMembersEndpoint.addMethod(
      "GET",
      new apigateway.LambdaIntegration(membersLambda),
      {},
    );
    allMembersEndpoint.addMethod(
      "OPTIONS",
      new apigateway.LambdaIntegration(membersLambda),
      {},
    );

    oneMemberEndpoint.addMethod(
      "POST",
      new apigateway.LambdaIntegration(memberLambda),
      {},
    );
    oneMemberEndpoint.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(memberLambda),
      {},
    );
    oneMemberEndpoint.addMethod(
      "OPTIONS",
      new apigateway.LambdaIntegration(memberLambda),
      {},
    );

    new cdk.CfnOutput(this, "BlueListsApiUrl", {
      value: api.url,
      exportName: "BlueListsApiUrl",
    });
  }
}

const app = new cdk.App();

new BlueListsDataStack(app, "BlueListsDataStack");
new BlueListsApiStack(app, "BlueListsApiStacks");

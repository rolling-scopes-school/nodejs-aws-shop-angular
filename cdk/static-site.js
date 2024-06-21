#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cloudFront = require("@aws-cdk/aws-cloudfront");
class StaticSite extends core_1.Construct {
  constructor(parent, name) {
    super(parent, name);
    const cloudFrontOAI = new cloudFront.OriginAccessIdentity(this, "JSCC-OAI");
    const siteBucket = new s3.Bucket(this, "JSCCStaticBucket", {
      bucketName: "siranush88-cloudfront-s3",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );
    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      "JSCC-distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );
    new s3deploy.BucketDeployment(this, "JSCC-Bucket-Deployment", {
      sources: [s3deploy.Source.asset("../dist/app")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0Esc0NBQXNDO0FBQ3RDLHVEQUF1RDtBQUV2RCx3Q0FBd0M7QUFDeEMsd0NBQWlEO0FBRWpELE1BQWEsVUFBVyxTQUFRLGdCQUFTO0lBQ3ZDLFlBQVksTUFBYSxFQUFFLElBQVk7UUFDckMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQixNQUFNLGFBQWEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFNUUsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN6RCxVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztTQUNsRCxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsbUJBQW1CLENBQzVCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQzVCLGFBQWEsQ0FBQywrQ0FBK0MsQ0FDOUQ7YUFDRjtTQUNGLENBQUMsQ0FDSCxDQUFDO1FBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQzNELElBQUksRUFDSixtQkFBbUIsRUFDbkI7WUFDRSxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLGNBQWMsRUFBRSxVQUFVO3dCQUMxQixvQkFBb0IsRUFBRSxhQUFhO3FCQUNwQztvQkFDRCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsaUJBQWlCLEVBQUUsSUFBSTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQ0YsQ0FBQztRQUVGLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUM1RCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxpQkFBaUIsRUFBRSxVQUFVO1lBQzdCLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFuREQsZ0NBbURDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG4vL0B0cy1ub2NoZWNrXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnQnO1xyXG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250JztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGljU2l0ZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgY29uc3RydWN0b3IocGFyZW50OiBTdGFjaywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUpO1xyXG4gICAgY29uc3QgY2xvdWRGcm9udE9BSSA9IG5ldyBjbG91ZEZyb250Lk9yaWdpbkFjY2Vzc0lkZW50aXR5KHRoaXMsICdKU0NDLU9BSScpO1xyXG5cclxuICAgIGNvbnN0IHNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdKU0NDU3RhdGljQnVja2V0Jywge1xyXG4gICAgICBidWNrZXROYW1lOiAnanMtY2MtY2xvdWRmcm9udC1zMycsXHJcbiAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXHJcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxyXG4gICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgfSk7XHJcblxyXG4gICAgc2l0ZUJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KFxyXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgYWN0aW9uczogWydTMzpHZXRPYmplY3QnXSxcclxuICAgICAgICByZXNvdXJjZXM6IFtzaXRlQnVja2V0LmFybkZvck9iamVjdHMoJyonKV0sXHJcbiAgICAgICAgcHJpbmNpcGFsczogW1xyXG4gICAgICAgICAgbmV3IGlhbS5DYW5vbmljYWxVc2VyUHJpbmNpcGFsKFxyXG4gICAgICAgICAgICBjbG91ZEZyb250T0FJLmNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eVMzQ2Fub25pY2FsVXNlcklkXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZEZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgICdKU0NDLWRpc3RyaWJ1dGlvbicsXHJcbiAgICAgIHtcclxuICAgICAgICBvcmlnaW5Db25maWdzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHNpdGVCdWNrZXQsXHJcbiAgICAgICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHk6IGNsb3VkRnJvbnRPQUksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJlaGF2aW9yczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0pTQ0MtQnVja2V0LURlcGxveW1lbnQnLCB7XHJcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQoJy4uL2Rpc3QnKV0sXHJcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBzaXRlQnVja2V0LFxyXG4gICAgICBkaXN0cmlidXRpb24sXHJcbiAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJy8qJ10sXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19

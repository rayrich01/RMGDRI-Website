import { S3Client, HeadBucketCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

function req(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const endpoint = req("R2_ENDPOINT");
const bucket = req("R2_BUCKET_NAME");

const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: req("R2_ACCESS_KEY_ID"),
    secretAccessKey: req("R2_SECRET_ACCESS_KEY"),
  },
  forcePathStyle: true,
});

(async () => {
  const started = new Date().toISOString();
  console.log(`R2 PROBE START ${started}`);
  console.log(`endpoint=${endpoint}`);
  console.log(`bucket=${bucket}`);

  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("✅ HeadBucket OK (bucket reachable with these creds)");
  } catch (e) {
    console.error("❌ HeadBucket FAILED");
    console.error(`name=${e?.name} status=${e?.$metadata?.httpStatusCode ?? "?"}`);
    console.error(e?.message ?? e);
    process.exit(1);
  }

  try {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
    const count = r.KeyCount ?? (r.Contents?.length ?? 0);
    const firstKey = r.Contents?.[0]?.Key ?? null;

    if (count === 0) {
      console.log("✅ ListObjects OK (bucket appears empty or no keys returned)");
    } else {
      console.log(`✅ ListObjects OK (bucket has at least 1 object) firstKey=${firstKey}`);
    }
  } catch (e) {
    console.error("❌ ListObjects FAILED (creds may be write-only or missing List permission)");
    console.error(`name=${e?.name} status=${e?.$metadata?.httpStatusCode ?? "?"}`);
    console.error(e?.message ?? e);
    process.exit(1);
  }

  console.log("R2 PROBE PASS ✅");
})();

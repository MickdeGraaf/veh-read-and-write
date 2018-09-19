import VehReadWrite from "./index.js";
import Bigchaindb from "bigchaindb-driver";
import Orm from "bigchaindb-orm";

async function go(){
  //generate a keypair
  const orm = new Orm( "http://128.199.46.166:9984/api/v1/",
                      {  app_id: '3b959424',
                         app_key: '30c12a0e15343d705a7e7ccb6d75f1c0'
                      });

  let keyPair = new orm.driver.Ed25519Keypair();

  console.log(keyPair);

  //st
  let vehReadWrite = new VehReadWrite({emulator: true, keyPair: keyPair});
  //create deviceID
  let deviceID = await vehReadWrite.uploader.registerDevice("SMART_METER", {lat: 51.923514, long: 4.469048}, 100, "office", 5);
  let asset = await vehReadWrite.uploader.getDeviceInfo(deviceID);
  console.log("////////////DEVICE");
  console.log(JSON.stringify(asset, null, 2));

  //restart rewrite with new deviceID
  vehReadWrite = new VehReadWrite({keyPair: keyPair, deviceID: deviceID});
  console.log(vehReadWrite.opts);

  //start the readwriter
  vehReadWrite.start();
}

go();

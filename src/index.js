import p1Reader from "p1-reader";
import uploader from "veh-bigchaindb-uploader";

class VehReadWrite {

    constructor(opts) {
        this.opts = opts;
        this.reader = new p1Reader(opts); //start reader with opts
        this.uploader = new uploader(opts);
        this.reading = this.reading.bind(this);
        this.lastReading = 0;
    }

    start() {
        this.reader.on('reading', this.reading);
        this.reader.on('error', this.error);
    }

    async reading(data) {
        const time = new Date().getTime();
        if(time > this.lastReading + 10 * 1000) { //rate limit to 10 secs
          let reading = this.convertData(data);
          this.uploader.update(this.opts.deviceID, reading);
          this.lastReading = time;
          console.clear();
          global.gc();
          console.log(reading);
        }
    }

    error(err) {
        console.log("error", err);
    }

    convertData(data) {
      const reading = {
        timestamp: data.timestamp,
        electricityReceived : {
            total: data.electricity.received.tariff1.reading + data.electricity.received.tariff2.reading,
            tarrif1: data.electricity.received.tariff1.reading,
            tariff2: data.electricity.received.tariff2.reading
        },
        electricityDelivered : {
            total: data.electricity.delivered.tariff1.reading + data.electricity.delivered.tariff2.reading,
            tarrif1: data.electricity.delivered.tariff1.reading,
            tariff2: data.electricity.delivered.tariff2.reading
        },
        gasReceived: data.gas.reading
      }

      return(reading);
    }

}

export default VehReadWrite;

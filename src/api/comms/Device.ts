import { DeviceType } from "../../renderer/types/devices";

// eslint-disable-next-line no-eval
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

interface Device {
  type: string;
  path: string;
  manufacturer: string;
  serialNumber: string;
  pnpId: string;
  locationId: string;
  productId: string;
  vendorId: string;
  timeout: number;
  result: string;
  callbacks: Array<any>;
  device: any;
  port?: any;
  commands?: any;
}

class Device {
  constructor(parameters: DeviceType, type: string) {
    // constructor for Device
    this.type = type;
    this.path = parameters.path;
    this.manufacturer = parameters.manufacturer;
    this.serialNumber = parameters.serialNumber;
    this.pnpId = parameters.pnpId;
    this.locationId = parameters.locationId;
    this.productId = parameters.productId;
    this.vendorId = parameters.vendorId;
    this.timeout = 5000;
    this.device = parameters.device;
    this.port = undefined;
    this.callbacks = [];
    this.result = "";
    this.commands = undefined;
  }

  static delay = (ms: number) =>
    new Promise(res => {
      setTimeout(res, ms);
    });

  static help = async (dev: any) => {
    const data = await dev.request("help");
    const result = data.split(/\r?\n/).filter((v: any) => v.length > 0);
    // console.log("requesting to fill help: ", dev, result);
    return result;
  };

  addPort = async (serialport: any) => {
    this.port = serialport;
    this.type = "serial";
    // Port is loaded, creating message handler
    const parser = this.port.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    parser.on("data", (data: any) => {
      const utfData = data.toString("utf-8");
      console.log("focus: incoming data:", utfData);

      if (utfData === "." || utfData.endsWith(".")) {
        const { result } = this;
        const resolve = this.callbacks.shift();

        this.result = "";
        if (resolve) {
          resolve(result.trim());
        }
      } else if (this.result.length === 0) {
        this.result = utfData;
      } else {
        this.result += `\r\n${utfData}`;
      }
    });
    const kbCommands = await Device.help(this);
    console.log("these are the commands", kbCommands);
    this.commands = {
      help: kbCommands,
    };
  };

  close = async () => {
    try {
      await this.port.close();
    } catch (error) {
      console.error(error);
    }
  };

  request(command: string, ...args: Array<any>) {
    console.log("focus.request:", command, ...args);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Communication timeout"));
      }, this.timeout);
      this.serialRequest(command, ...args)
        .then(data => {
          clearTimeout(timer);
          resolve(data);
        })
        .catch(err => {
          console.log("Error sending request from focus", err);
          reject(new Error("Error sending request from focus"));
        });
    });
  }

  async serialRequest(cmd: string, ...args: any[]) {
    console.log("performing request");
    if (!this.port) throw new Error("Device not connected!");

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    return new Promise(resolve => {
      this.callbacks.push(resolve);
      this.port.write(request);
    });
  }

  command = async (command: string, ...args: Array<string>) => {
    if (this.port === undefined) return false;
    // if (typeof this.commands[command] === "function") {
    //   return this.commands[command](this, ...args);
    // }
    // if (typeof this.commands[command] === "object") {
    //   return this.commands[command].focus(this, ...args);
    // }
    return this.request(command, ...args);
  };

  write_parts = async (parts: Array<any>, cb: () => void) => {
    if (!parts || parts.length === 0) {
      cb();
      return;
    }

    let part = parts.shift();
    part += " ";
    this.port.write(part);
    this.port.drain(async () => {
      await this.write_parts(parts, cb);
    });
  };

  addCommands = (cmds: string) => {
    Object.assign(this.commands, cmds);
  };

  addMethod = (methodName: string, command: string) => {
    const keyedMethodName = methodName as keyof Device;
    if (this[keyedMethodName]) {
      const tmp = this[keyedMethodName];
      this[keyedMethodName] = (...args: Array<any>) => {
        tmp(...args);
        this.commands[command][methodName](...args);
      };
    } else {
      this[keyedMethodName] = (...args: Array<any>) => {
        this.commands[command][methodName](...args);
      };
    }
  };
}

export default Device;

# Buildlight for NodeJS

Drives a buildlight by polling jenkins and turning the buildlight into the apropriate color

First time optionally follow the Linux instructions and then `npm install` 

Run with `node check-build.js`

# Linux speciffic prerequisites

Node-hid requires libudev-dev and libusb-1.0-0 to install successfully.  On Raspian, you can install these using:

```shell
sudo apt-get install libudev-dev libusb-1.0-0-dev
```
On Linux you also need to grant permissions to write to the Delcom device.  On Raspian, you can create a file:

```shell
sudo nano /etc/udev/rules.d/85-delcom.rules
```

With the following rule (replace the group name with a group of your choice):

```shell
SUBSYSTEM=="usb", ATTRS{idVendor}=="0fc5", ATTRS{idProduct}=="b080", ACTION=="add", SYMLINK+="delcom", MODE="0666", GROUP="pi"
```

You will have to reboot to make the rule take effect.

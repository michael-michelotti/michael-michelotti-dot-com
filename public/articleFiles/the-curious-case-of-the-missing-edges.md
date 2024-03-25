You can hardly swing a cat around the embedded systems ecosystem without hitting Linux. I have tons of experience as a user of Linux, but not so with much programming drivers in kernel-space. To change that, I decided to write a `sysfs` platform device driver for a [DHT11 humidity sensor](https://www.adafruit.com/product/386).

Lo and behond, the Linux kernel a [DHT11 driver](https://github.com/torvalds/linux/blob/master/drivers/iio/humidity/dht11.c). That's fine. I'm really looking to practice compilation of the Linux kernel, configuration of the device tree, and module insertion. Still, just to be a little original, I decided to rewrite it as a `sysfs` driver which could be read through `cat`.

If you don't know anything about the DHT11 sensor, it's one of those _no-protocol_ sensors that needs to be bit-banged. You pull it's data line high, and it pulls the data line low in short or long pulses to indicate `0` and `1`. Typically, you would drive this type of sensor by listening for edges and generating interrupts accordingly. 

The sensor pulses $20\,\mu s$ for `0` and $70\,\mu s$ for `1`. My [BeagleBone Black](https://www.beagleboard.org/boards/beaglebone-black) clocks its MCU at $1\,GHz$. More than enough time resolution to detect these pulses. Piece of cake :cake:. That's what I thought, at least. The events that followed saw me developing a true appreciation for Real Time Operating System (RTOS) kernels.

You see, this isn't bare metal programming. Here, we don't enable interrupts directly in `NVIC` registers. Here, we request interrupts from Linux. We don't choose when to service our interrupts; Linux services them on it's own sweet time. We are all at the mercy of the kernel :pray:, and Linux might not think your driver is the most important thing on it's plate right now.

As I loaded my module and requested the temperature, I found that my driver would only detect about half the edges I saw with my logic analyzer. I knew they were there. However, it seemed like Linux did not find my driver important enough to count one edge quickly before the next edge came.

For a while, I was dejected that the Linux kernel didn't care about my driver :disappointed:. _Fine_, I thought, if you don't care about my driver, then I don't care about _you_. Why should be so courteous as to sleep and wait for another edge if you won't even wake me up in time?! I rewrote my interrupt-based approach to a blocking, polling-based one. Guess who can now read the humidity :ocean:.

<img src="/img/dht11_cat_temp_hum_usage.png" alt="Reading humidity from Linux command line" style="max-width: 600px; height: auto; margin: 1.8rem;">

_P.S. Apologies to any other processes that need to wait for my blocking call. Blame the kernel_ :stuck_out_tongue_winking_eye:.

[Project link](https://github.com/michael-michelotti/dht11-linux-driver)

## The Problem
As part of my [IR Remote Fan project](https://github.com/michael-michelotti/ir-remote-fan), I had an MCU process commands from an IR remote, and use those commands to drive a motor. 

I used a brushed DC motor, which are particularly noisy. Here's what my initial setup looked like:

![IR remote fan starting setup](/img/Power_Supply_Ripple_Setup_Smaller.png)

I had long jumper cable runs. I figured bypass capacitors wouldn't be necessary. My ground contact points were scattered. In short, an EMI nightmare! 

The consequences of this soon became clear. As soon as my push-pull driver began to drive my fan, my power lines became inundated with voltage dips and rings. This caused the voltage on my IR receiver input line to dip all the way down below 1V regularly!

![Oscilloscope showing voltage dip](/img/Ripple_Medium_Zoom_50duty.png)

Since I had my MCU monitoring edges and subsequently producing interrupts on this input line, as soon as I drove the motor my interrupt handler would get spuriously triggered indefinitely. 

## The Solution
It became clear that driving such a noisy load using input from such a sensitive sensor would be a difficult task on a breadboard. Here are the steps I took:

* I bought a set of short M-F jumper wires to shorten the run from my dev board to the breadboard.
* I placed a 100nF bypass capacitor across the input of the IR receiver.
* I placed a 100nF __and__ 100uF capcaitor across the push-pull driver.
* I huddled all my ground touch points as closely as possible on the breadboard.
* I twisted the cable to my motor.

Here was my setup after I took all of these EMI mitigation steps: 

![IR remote fan ending setup](/img/Setup_Photo_20240321.JPG)

Each of these mitigation steps did not produce much on their own. However, taken together I was able to reduce the noise coming off my motor enough to stop triggering interrupts on my MCU and successfully control the fan!

Here is what the noise looked like post-mitigation:

![IR remote fan ending setup](/img/20240321_Update_Ripple.png)

## Takeaway
TSOP IR receiver modules are sensitive, and DC motors being driven by PWM are loud. Who knew

I'm still a novice in the world of EE, but I learned a lot about working around noisy components in this exercise. Keep your cable runs short, twist paired signals, and always use bypass capacitors!

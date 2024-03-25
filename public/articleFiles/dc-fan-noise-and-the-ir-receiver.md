It was just another Tuesday when I decided on what would become my next embedded systems project. I knew I wanted to have _some sensor_ drive _some motor_. In my innocence, I chose a TSOP IR receiver and a DC motor. The IR receiver would pick up a signal from an IR remote, then I would process that signal to control the fan. Perfect.

Excitedly, I got to work planning and developing. 
* An NEC driver to decode my receiver? Functioning in isolation. :triumph: 
* A PWM-based L293D driver to power my fan? Functioning in isolation. :smirk: 

It was all coming together. It was finally time to hook it all up, sit back, and watch the magic happen. I sat back and reveled in my creation.

<img src="/img/Power_Supply_Ripple_Setup_Smaller.png" alt="IR remote fan initial setup photo" style="max-width: 500px; height: auto; margin: 1.8rem;">

Looking back at this setup, I want to shake my innocent previous self and say:
> Look at all these jumper cable antennas you have looping left and right. Where are your bypass capacitors?! You believe this will work. You sweet summer child.

I applied power and watched in horror as my receiver signal spiked and dipped uncontrollably :scream:. Once I recovered from the shock, I hauled out my oscilloscope to see the damage.

<img src="/img/Ripple_Medium_Zoom_50duty.png" alt="Oscilloscope screenshot showing noise spike" style="max-width: 500px; height: auto; margin-bottom: 1.8rem;">

Clearly, this would take some work.

Firstly, my [Dr. meter DC power supply](https://drmeter.com/collections/power-supply/products/dc-bench-power-supply-30v-10a-dr-meter) had a $160\,mV$ ripple under no load at all. It's got to go. Give me a nice clean $5V$ coming right of a wall wart. I replace the power supply. Power it up. Still no dice. 

Alright, what if I twist the cables going to my motor? Surely that will cancel out some noise. I twisted them, to no avail. Maybe I'm out of my depth here. Maybe I should put up the SOS signal at `eevblog.com`.

The heroes who peruse that website came through big. 
* My MCU pin was $5V$ tolerant, I didn't need a level shifter. 
* I could supply both logic and power from a single power source by regulating my $5V$ rail with a $3.3V$ LDO. 
* Those who had previously used the same IR receiver recommended a $100\,nF$ across it.
* Those who had driven motors recommended a $100\,\mu F$ _and_ $100\,nF$ across the motor driver. 
* My cable runs were just silly, and needed to be shortened.

Feeling their collective hands on my shoulders, I got to work. I implemented an improvement, I tested. I implemented another, and tested again. Each time, the ringing looked just a bit better.

<img src="/img/IR_Remote_Fan_Final_Setup.JPG" alt="IR remote fan setup post mitigation" style="max-width: 500px; height: auto; margin-bottom: 1.8rem;">

Finally, my IR receiver was happy. Finally, I turned on the fan. Alas, I'm still using cheap components on a breadboard, and thus the ringing remains. But hey, __I can turn on the fan__ :relieved:.

<img src="/img/Final_Ripple_After_Mitigation.png" alt="Oscilloscope screenshot post mitigation" style="max-width: 500px; height: auto; margin-bottom: 1.8rem;">

[Project link](https://github.com/michael-michelotti/ir-remote-fan)

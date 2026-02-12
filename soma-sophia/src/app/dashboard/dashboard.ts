import { signal, Component } from '@angular/core';

const HARDCODED_ROUTINE = `# Warm Up

* Neck circles // check for better naming
* Cat/cow pose
* Wrist opposite palm circles
* Wrist top circles
* Ankle sitting

## Shoulder mobility
* Foam roll scapula and triceps
* Elevated Straight arm push down 60s - 120s // check for better naming
* laying straight arm rows // check for better naming

## Hamstring/Pike

* Chair seated hip hinge
* Downward facing dog
* Standing pike to squat and back
* Mckenzi push ups
* Seated pike

# Strength

* bend leg v sit on floor 3x[time]
2 min rest
* 3x
    * push ups x10
    * chest to bar pull ups x5
    * compression work x12
2 min rest
* 3x
    * reverse elevated plank x30sec
    * ring holds x30sec`

@Component({
  selector: 'ss-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
    protected readonly routine = signal(HARDCODED_ROUTINE);
}

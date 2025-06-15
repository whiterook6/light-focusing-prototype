export type CallbackFN = (deltaTimeMS: number) => void;

export class AnimationLoop {
  private update: CallbackFN;
  private paused: boolean = false;
  private static tickLengthMs: number = 1000 / 60;
  private intervalID?: NodeJS.Timeout;
  
  constructor(callback: CallbackFN){
    this.update = callback;
  }
  
  public start = () => {
    if (this.isPaused() || !this.intervalID){
      this.paused = false;
      this.intervalID = setInterval(this.gameLoop, AnimationLoop.tickLengthMs);
    }
  }
  
  public stop = () => {
    this.paused = true;
    if (this.intervalID){
      clearInterval(this.intervalID);
      this.intervalID = undefined;
    }
  }
  
  public togglePause = (): void => {
    if (this.isPaused()){
      this.start();
    } else {
      this.stop();
    }
  }
  
  public isPaused = (): boolean => {
    return this.paused;
  }
  
  public gameLoop = (): void => {
    if (this.isPaused()){
      return;
    }
    
    this.update(AnimationLoop.tickLengthMs);
  }
}

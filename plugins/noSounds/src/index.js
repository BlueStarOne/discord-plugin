module.exports = class {
  start() {
    this.sounds = [
      "USER_JOINED", "USER_LEFT",
      "MUTE", "UNMUTE", "DEAFEN", "UNDEAFEN",
      "STREAM_STARTED", "STREAM_ENDED"
    ];
    
    const orig = globalThis.SoundPlayer;
    globalThis.SoundPlayer = (ctx, sound, cb) => {
      const name = sound.name || sound.toString().split('.').pop();
      if (this.sounds.includes(name)) {
        console.log(`[noSounds] BLOCKED: ${name}`);
        if (cb) cb();
        return null;
      }
      return new orig(ctx, sound, cb);
    };
    
    console.log("noSounds: ALL VC SOUNDS BLOCKED");
  }
  
  stop() {
    // Restore later if needed
  }
};
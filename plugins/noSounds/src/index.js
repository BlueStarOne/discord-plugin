/**
 * @name noSounds
 * @description Mute all UI and VC sounds (join/leave, clicks, pings)
 * @author Blue
 * @version 2.0.0
 */

module.exports = class {
  start() {
    this.unpatch = [];

    // 1. Global UI sounds (clicks, pings)
    const globalOrig = globalThis.playSound || globalThis.__playSound;
    if (globalOrig) {
      const block = () => null;
      globalThis.playSound = block;
      globalThis.__playSound = block;
      console.log("[noSounds] Global UI sounds muted");
    }

    // 2. VoiceEngine — VC join/leave dings
    const VoiceEngine = globalThis.findModuleByProps?.("playSound") ||
                        globalThis.findModule?.(m => m.playSound && m.connect);
    if (VoiceEngine?.playSound) {
      const orig = VoiceEngine.playSound;
      this.unpatch.push(() => { VoiceEngine.playSound = orig; });
      VoiceEngine.playSound = (soundId) => {
        if (["user_join", "user_leave", "call_join", "call_leave"].includes(soundId)) {
          console.log(`[noSounds] BLOCKED VC: ${soundId}`);
          return;
        }
        return orig(soundId);
      };
      console.log("[noSounds] VoiceEngine VC sounds muted");
    }

    // 3. SoundBoard fallback
    const SoundBoard = globalThis.findModuleByProps?.("playSound") ||
                       globalThis.findModule?.(m => m.playSound && m.sounds);
    if (SoundBoard?.playSound) {
      const orig = SoundBoard.playSound;
      this.unpatch.push(() => { SoundBoard.playSound = orig; });
      SoundBoard.playSound = () => {
        console.log("[noSounds] BLOCKED SoundBoard");
        return null;
      };
    }

    console.log("noSounds v2: FULL SILENCE ACTIVE");
  }

  stop() {
    this.unpatch.forEach(fn => fn());
    console.log("[noSounds] All sounds restored");
  }
};
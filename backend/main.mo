import Float "mo:core/Float";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  type Reading = {
    voltage : Float; // Voltage in Volts
    current : Float; // Current in Amperes
    energy : Float; // Energy in Joules
    footstepCount : Nat; // Cumulative footstep count
    batteryLevel : Nat; // Battery level in percentage (0-100)
    usbOutputActive : Bool; // True if USB output is active
  };

  var latestReading : ?Reading = null;

  public type BatteryStatus = {
    percentage : Nat; // Battery level (0-100)
    status : Text; // "CHARGING" | "IDLE" | "AWAITING DATA"
  };

  public shared ({ caller }) func submitReading(reading : Reading) : async () {
    latestReading := ?reading;
  };

  public query ({ caller }) func getLatestReading() : async ?Reading {
    latestReading;
  };

  public query ({ caller }) func getBatteryStatus() : async BatteryStatus {
    switch (latestReading) {
      case (null) {
        {
          percentage = 0;
          status = "AWAITING DATA";
        };
      };
      case (?reading) {
        {
          percentage = reading.batteryLevel;
          status = if (reading.usbOutputActive) {
            "CHARGING";
          } else {
            "IDLE";
          };
        };
      };
    };
  };
};

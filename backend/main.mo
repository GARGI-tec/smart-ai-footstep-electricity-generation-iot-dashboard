import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Text "mo:core/Text";
import VarArray "mo:core/VarArray";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type EnergyRecord = {
    timestamp : Time.Time;
    footsteps : Nat;
    voltage : Float;
    batteryLevel : Nat;
    mode : Text;
  };

  var batteryLevel = 100;
  var mode = "charging";
  var recordCount = 0;
  var currentHour : ?Nat = null; // Track the current simulated hour
  var hardwareConnected = false; // Track hardware connection

  let records = VarArray.repeat<EnergyRecord>({
    timestamp = 0;
    footsteps = 0;
    voltage = 0.0;
    batteryLevel = 0;
    mode = "";
  }, 8760);

  public shared ({ caller }) func advanceTime() : async () {
    let currentTime = Time.now();
    let hour = getHour(currentTime);
    currentHour := ?hour; // Store the current hour

    let footsteps = calculateFootstepsByHour(hour);
    let voltage = getVoltageByHour(hour);
    var newBatteryLevel = batteryLevel;

    // Update battery level based on current mode
    switch (mode) {
      case ("charging") {
        newBatteryLevel += chargeBattery(voltage);
        if (newBatteryLevel >= 90) {
          mode := "redirecting";
        };
      };
      case ("redirecting") {
        // Power is redirected to devices, battery level remains stable
        if (footsteps < 50 and newBatteryLevel > 0) {
          mode := "depleting";
        };
      };
      case ("depleting") {
        newBatteryLevel := depleteBattery(voltage);
        if (newBatteryLevel < 30) {
          mode := "charging";
        };
      };
      case (_) {}; // Unrecognized mode, do nothing;
    };

    // Ensure battery level is within 0-100% range
    if (newBatteryLevel > 100) {
      newBatteryLevel := 100;
    } else if (newBatteryLevel < 0) {
      newBatteryLevel := 0;
    };

    let record = {
      timestamp = currentTime;
      footsteps;
      voltage;
      batteryLevel = newBatteryLevel;
      mode;
    };

    // Update records array with new record
    if (recordCount < 8760) {
      records[recordCount] := record;
      recordCount += 1;
    };

    // Update state variables
    batteryLevel := newBatteryLevel;
  };

  public query ({ caller }) func getRecords() : async [EnergyRecord] {
    // Convert the records array to a regular array and filter out empty records
    let fullRecords = Array.tabulate(
      recordCount,
      func(i) { records[i] }
    );
    fullRecords.filter(
      func(record) { record.timestamp != 0 }
    );
  };

  public query ({ caller }) func getCurrentHour() : async Nat {
    switch (currentHour) {
      case (?hour) { hour };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getFootstepsByHour(hour : Nat) : async Nat {
    calculateFootstepsByHour(hour);
  };

  public shared ({ caller }) func getFootstepsToday() : async Nat {
    let currentTime = Time.now();
    let currentHour = getHour(currentTime);
    var totalFootsteps = 0;

    var i = 0;
    while (i < records.size()) {
      let record = records[i];
      if (record.timestamp != 0) { // Ensure we're checking only valid records
        let recordTime = getHour(record.timestamp);
        if (recordTime == currentHour) {
          totalFootsteps += record.footsteps;
        };
      };
      i += 1;
    };
    totalFootsteps;
  };

  public shared ({ caller }) func adjustEnergyMode() : async () {
    if (batteryLevel > 100) {
      batteryLevel := 100;
    } else if (batteryLevel < 0) {
      batteryLevel := 0;
    };

    if (batteryLevel > 90) {
      mode := "redirecting";
    } else if (batteryLevel < 30) {
      mode := "charging";
    };
  };

  public query ({ caller }) func isHardwareConnected() : async Bool {
    hardwareConnected;
  };

  func getHour(timestamp : Int) : Nat {
    // Convert timestamp to hour (0-23) using seconds since epoch
    ((timestamp / 1_000_000_000) % 86400 / 3600).toNat();
  };

  func calculateFootstepsByHour(hour : Nat) : Nat {
    if (hour >= 6 and hour < 12) {
      80 + ((hour - 6) * 10);
    } else if (hour >= 12 and hour < 18) { 30 } else {
      (24 - hour) * 5;
    };
  };

  func getVoltageByHour(hour : Nat) : Float {
    if (hour >= 6 and hour < 12) {
      5.0 + (hour - 6).toFloat() * 0.5;
    } else if (hour >= 12 and hour < 18) { 2.0 } else { 1.0 };
  };

  func chargeBattery(voltage : Float) : Nat {
    (voltage * 10).toInt().toNat();
  };

  func depleteBattery(voltage : Float) : Nat {
    let depletionRate : Int = if (voltage < 2) { 10 } else { 3 };
    if (batteryLevel >= depletionRate) {
      (batteryLevel - depletionRate).toNat();
    } else {
      batteryLevel;
    };
  };
};

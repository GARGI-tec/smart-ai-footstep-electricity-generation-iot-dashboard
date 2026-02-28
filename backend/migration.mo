module {
  type OldActor = {
    batteryLevel : Nat;
    mode : Text;
    recordCount : Nat;
    currentHour : ?Nat;
    records : [var { timestamp : Int; footsteps : Nat; voltage : Float; batteryLevel : Nat; mode : Text }];
  };

  type NewActor = {
    batteryLevel : Nat;
    mode : Text;
    recordCount : Nat;
    currentHour : ?Nat;
    records : [var { timestamp : Int; footsteps : Nat; voltage : Float; batteryLevel : Nat; mode : Text }];
    hardwareConnected : Bool;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      hardwareConnected = false;
    };
  };
};

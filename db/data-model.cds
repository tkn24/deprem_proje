namespace deprem;
entity Deprem {
  key eventID          : String;
      date             : String;
      magnitude        : Decimal(4,2);
      depth            : Decimal(5,2);
      latitude         : String;
      longitude        : String;
      location         : String;
      rms              : String;
      type             : String;
      country          : String;
      province         : String;
      district         : String;
      neighborhood     : String;
      isEventUpdate    : Boolean;
      lastUpdateDate   : String;
}

export interface ICityData {
    CityId: string;
    CountryId: string;
    CountryName: string;
    PlaceId: string;
    PlaceName: string;
    RegionId: string;
}

export interface IGetCityListResponse {
    Places: Array<ICityData>
}

export interface Carrier {
    CarrierId: number;
    Name: string;
}

export interface Currency {
    Code: string;
    Symbol: string;
}

export interface Quotes {
    Direct: boolean;
    MinPrice: number;
    QuoteId: number;
    QuoteDateTime: Date;
    OutboundLeg: {
        CarrierIds: Array<number>;
        DepartureDate: Date;
        DestinationId: number;
        OriginId: number;
    }
}
export interface FlightData {
    Carriers: Array<Carrier>;
    Currencies: Array<Currency>;
    Places: any;
    Quotes: Array<Quotes>;
    Routes: any;
}

export interface FormattedFlightData {
    price: number;
    direct: boolean;
    carrier: Carrier;
    date: Date,
    currency: Currency["Symbol"],
}

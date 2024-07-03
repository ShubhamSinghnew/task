import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the City schema
const CitySchema = new Schema({
    id: Number,
    name: String,
    latitude: String,
    longitude: String
});

// Define the State schema
const StateSchema = new Schema({
    id: Number,
    name: String,
    state_code: String,
    latitude: String,
    longitude: String,
    type: { type: String, default: null },
    cities: [CitySchema]
});

// Define the Country schema
const CountrySchema = new Schema({
    id: Number,
    name: String,
    iso3: String,
    iso2: String,
    numeric_code: String,
    phone_code: String,
    capital: String,
    currency: String,
    currency_name: String,
    currency_symbol: String,
    tld: String,
    native: String,
    region: String,
    region_id: String,
    subregion: String,
    subregion_id: String,
    nationality: String,
    timezones: [
        {
            zoneName: String,
            gmtOffset: Number,
            gmtOffsetName: String,
            abbreviation: String,
            tzName: String
        }
    ],
    translations: {
        kr: String,
        pt_BR: String,
        pt: String,
        nl: String,
        hr: String,
        fa: String,
        de: String,
        es: String,
        fr: String,
        ja: String,
        it: String,
        cn: String,
        tr: String
    },
    latitude: String,
    longitude: String,
    emoji: String,
    emojiU: String,
    states: [StateSchema]
});

// Create the models
const Country = mongoose.model('country_state_cities', CountrySchema);

export { Country };

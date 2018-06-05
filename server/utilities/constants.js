/*
CATEGORY
0:
1:
2:
3:
4:
5:

TIME HORIZON
0:
1:
2:

MATURITY
0:
1:
2:
3:
4:

INVESTABLE_INSTRUMENT
0: PUBLIC EQUITY (The company is listed at stock exchange)
1: PRIVATE EQUITY (The company is not listed at the stock exchange i.e. pre IPO)
2: COINS OR TOKENS (The company will issue or has issued coins or tokens)
3: I DON'T KNOW
*/

const constants = {
    MIN_TIME_HORIZON: 0,
    MAX_TIME_HORIZON: 2,
    TOTAL_TIME_HORIZON_VALUES: 3,
    MIN_MATURITY: 0,
    MAX_MATURITY: 4,
    TOTAL_MATURITY_VALUES: 5,
    MIN_GEOGRAPHY: 0,
    MAX_GEOGRAPHY: 5,
    TOTAL_GEOGRAPHY_VALUES: 6,
    MIN_CATEGORY: 0,
    MAX_CATEGORY: 5,
    TOTAL_CATEGORY_VALUES: 6,
    MIN_EXPOSURE: 0,
    MAX_EXPOSURE: 4,
    TOTAL_EXPOSURE_VALUES: 5,
    MIN_INVESTABLE_INSTRUMENT: 0,
    MAX_INVESTABLE_INSTRUMENT: 3,
    TOTAL_INVESTABLE_INSTRUMENT_VALUES: 4
};

export default constants;
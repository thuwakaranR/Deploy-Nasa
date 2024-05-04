const demoKey=process.env.REACT_APP_API_KEY

export const APOD_API=`https://api.nasa.gov/planetary/apod?api_key=${demoKey}`;

export const EPIC_API='https://api.nasa.gov/EPIC/api/natural/date/';
export const DONKI_API='https://api.nasa.gov/DONKI/notifications';
export const ROVER_API='https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date';
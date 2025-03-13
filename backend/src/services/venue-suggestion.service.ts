import {
  GooglePlaceDetails,
  GooglePlacePhoto,
  GooglePlaceResult,
  GooglePlacesResponse,
  VenueResult,
} from "../types/google-places";

class VenueSuggestionService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("Google Places API key is not defined");
    }
  }

  async getSuggestions(params: {
    activityType: string;
    location: { lat: number; lng: number };
    radius: number;
    limit: number;
  }): Promise<VenueResult[]> {
    const keywords = this.mapActivityToKeywords(params.activityType);
    const type = this.mapActivityToPlaceType(params.activityType);

    // radius: up to 10km
    const radius = Math.min(10000, params.radius);

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const queryParams = new URLSearchParams({
      key: this.apiKey,
      location: `${params.location.lat},${params.location.lng}`,
      radius: radius.toString(),
      keyword: keywords.join(" "),
      type: type,
    });

    const response = await fetch(`${url}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    let data = (await response.json()) as GooglePlacesResponse;

    if (data.results.length === 0) {
      // Retry without type parametertry without type parameter
      if (type) {
        queryParams.delete("type");
        const retryResponse = await fetch(`${url}?${queryParams.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (retryResponse.status === 200) {
          const retryData =
            (await retryResponse.json()) as GooglePlacesResponse;
          data = retryData;
        }
      }
    }

    // Get top 3 results and format
    const venues = data.results
      .slice(0, params.limit)
      .map((place) => this.formatPlaceResult(place, params.activityType));

    // Get detailed information
    const venuesWithDetails = await Promise.all(
      venues.map((venue) => this.getPlaceDetails(venue)),
    );

    return venuesWithDetails;
  }

  private async getPlaceDetails(venue: VenueResult): Promise<VenueResult> {
    if (!venue.place_id) return venue;

    try {
      const url = "https://maps.googleapis.com/maps/api/place/details/json";
      const queryParams = new URLSearchParams({
        key: this.apiKey,
        place_id: venue.place_id,
        fields: "website,formatted_phone_number,opening_hours,price_level",
      });

      const response = await fetch(`${url}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        return venue;
      }

      const details = (await response.json()) as GooglePlaceDetails;

      return {
        ...venue,
        website: details.result?.website || venue.website,
        phone: details.result?.formatted_phone_number,
        openingHours: details.result?.opening_hours?.weekday_text,
        priceLevel: this.formatPriceLevel(details.result?.price_level),
      };
    } catch (error) {
      return venue;
    }
  }

  private formatPlaceResult(
    place: GooglePlaceResult,
    activityType: string,
  ): VenueResult {
    return {
      name: place.name,
      place_id: place.place_id,
      location: {
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      photos: place.photos
        ? place.photos
            .slice(0, 1)
            .map(
              (photo: GooglePlacePhoto) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`,
            )
        : [],
      activityType: activityType,
    };
  }

  private mapActivityToKeywords(activity: string): string[] {
    const mapping = {
      // Birthday event
      "Birthday party": ["birthday party venue", "party room", "celebration"],
      Bowling: ["bowling alley", "bowling center"],
      Karaoke: ["karaoke", "karaoke bar", "singing room"],

      // Family and friends
      Picnic: ["picnic", "park", "garden", "outdoor"],
      Hiking: ["hiking", "trail", "nature", "mountain"],
      "Mini golf": ["mini golf", "miniature golf", "putt putt"],

      // Spring event
      "Cherry blossom viewing": [
        "cherry blossom",
        "sakura",
        "hanami",
        "botanical garden",
      ],
      "Outdoor cafe": ["outdoor cafe", "patio dining", "terrace restaurant"],
      "Farmers market": ["farmers market", "spring market", "local produce"],
    };

    return mapping[activity as keyof typeof mapping] || [activity];
  }

  private mapActivityToPlaceType(activity: string): string {
    const mapping = {
      // Birthday event
      "Birthday party": "restaurant",
      Bowling: "bowling_alley",
      Karaoke: "night_club",

      // Family and friends
      Picnic: "park",
      Hiking: "natural_feature",
      "Mini golf": "amusement_park",

      // Spring event
      "Cherry blossom viewing": "park",
      "Outdoor cafe": "cafe",
      "Farmers market": "shopping_mall",
    };

    return mapping[activity as keyof typeof mapping] || "";
  }

  private formatPriceLevel(level?: number): string {
    const mapping = {
      0: "Free",
      1: "Inexpensive",
      2: "Moderate",
      3: "Expensive",
      4: "Very Expensive",
    };

    return (
      mapping[level as keyof typeof mapping] ||
      "Price information not available"
    );
  }
}

export const venueSuggestionService = new VenueSuggestionService();

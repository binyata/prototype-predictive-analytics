# Spike Dashboard

## Overview

We need to find the best option for a dashboard that will display the state of Utah that is split into borders by county that can be interacted with data from our system.

Business Needs:

- Option that can render at the state level of the United States that correctly displays county borders
- The state needs to be interactable
- When the user hovers the mouse over a county, it will display data about this county

## Options

### Existing Libraries

This involves 3 libraries that are known to generate topology or visuals for the user interface:

- GeoJSON: Text-based format for encoding geographic data structures like points, lines, and polygons
- TopoJSON: An extension of GeoJSON that encodes topology
- D3: General visualizing data tool

#### Pros:

- Meets business needs of an interactable county bordered state map that can be used to display forecasted sprained ankle data
- Many opportunities to expand on feature due to customizations that can be applied to maps
- No cost
- Works offline

#### Cons:

- More development time up front (unless AI can speed up this process)
- Multiple libraries to juggle and to debug if something goes wrong
- If implemented poorly, can cost performance

### Google Maps Platform

#### Pros:

- Easy to pick up
- Documentation available
- For niche cases, could reach out to support

#### Cons:

- There doesn't look to be a standard way of making the entire county body of a state interactable, without paying for an additional 3rd party service, thus not making meeting business requirements feasible
- Features such as People API or directions are not features that the business is needing at this time
- Will cost monthly for the following:
  $100/month for 50k monthly calls
  $275/month for 100k monthly calls and additional places features
  $1200/month for 250k monthly calls and additional places features

### Pure AI generation of SVG of Utah

Reading this, you may ask why even add this option? The goal of these spike documents for me are to share the routes I took to solve this problem. The value that comes from routes that were mostly cons can teach either the author or the reader for future projects to be aware of what happens when this option is explored. It is possible in the future that AI can improve to the point of building these SVG images correctly.

I don't intend to blurt every option unless there is some value that can come from it.

#### Pros:

- Possibility of pure customization

#### Cons:

- Although the shape of the state of Utah was correct, the county borders were not generating properly
- Would require a lot of trial and error to make sure that the borders are correct
- Would require reinventing the wheel to build what something like D3 or GeoJSON already offers

## Conclusion

Comparing the pros and cons of each option, the only option that meets business requirements out of the box is the existing libraries option. The existing libaries option offers many customizations that can be expanded on to any living, evolving product. There is no concern of subscribing to any 3rd party services.

## Sources

Information used to conclude option:

- (Existing Libraries:topojson-client) https://github.com/topojson/topojson-client
- (Existing Libraries:topojson-specification) https://github.com/topojson/topojson-specification
- (Existing Libraries:d3) https://github.com/d3/d3
- (Existing Libraries:GeoJson) https://geojson.org/
- (Google Maps Service) Overview https://developers.google.com/maps/documentation/javascript/overview
- (Google Maps Service: Adding to Reactjs) https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0
- (Google Maps Service: Cost) https://mapsplatform.google.com/pricing/
- (Google Maps Service: Places API) https://developers.google.com/maps/documentation/places/web-service/overview
- (Pure AI generation of SVG of Utah) Used chatgpt and gemini

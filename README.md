# simLife
An interactive web-based evolutionary simulation that models the behavior, survival, and adaptation of simple organisms in a 2D environment.

simLife is a visual demonstration of evolutionary principles through computational modeling. Watch as autonomous organisms (biotas) navigate their environment, seek food, consume energy, and reproduce with slight mutations—creating an emergent ecosystem governed by natural selection.

- **Autonomous Biotas**: Self-governing organisms with unique characteristics
  - Randomized limb count (5-15 limbs)
  - Individual speed and movement parameters
  - Energy management system
  - Reproduction with mutation mechanics
  - Dynamic swimming motion with limb animation

- **Dynamic Ecosystem**
  - Food source (planktons) that biotas hunt and consume
  - Energy-based survival mechanics
  - Population dynamics through reproduction and energy depletion

- **Evolutionary Mechanics**
  - Mutations during reproduction (limb count, speed, movement patterns, color)
  - Natural selection through energy management
  - Emergent behavior from simple rules

- **Interactive Controls**
  - Drag and move biotas with mouse
  - Add planktons by clicking on the canvas
  - Real-time visualization with trail effects

## Getting Started

Run the following commands to start the HTTP server, then open your browser to `http://localhost:8080/`

### Using Make
```sh
make run
```

### Manual Setup
```sh
cd src/
python -m http.server 8080
```


## Roadmap

### Current State
- ✅ Basic biota movement and animation
- ✅ Energy consumption and food mechanics
- ✅ Reproduction with mutations
- ✅ Mouse interaction (drag biotas, add planktons)
- ✅ Visual trail effects

### Planned Features

- [ ] Performance optimization for nearest plankton calculation
- [ ] Statistics dashboard (population, energy levels, generations)
- [ ] Pause/play/speed controls
- [ ] Adjustable simulation parameters (mutation rate, energy costs)
- [ ] Save/load simulation state
- [ ] Historical tracking of evolutionary changes
- [ ] Predator-prey dynamics (multiple species)
- [ ] Environmental hazards and obstacles
- [ ] Genetic algorithm refinement
- [ ] Data export for analysis
- [ ] Community sharing of interesting simulations

## Contributing

This is an experimental project exploring evolutionary computation and emergent behavior. Ideas and contributions are welcome!

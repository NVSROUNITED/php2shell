/* All records below are fictional teaching data. They do not represent real requests or memory. */
window.PHP2SHELL_CASES = {
  'cve-2026-109618': {
    title: 'CVE-2026-109618 · OOM corruption path',
    result: 'Training interpretation: the PHP advisory describes invalid request state after an out-of-memory early exit. This replay stops at impact classification; no memory is accessed and no code is executed.',
    events: [
      { time: 'T+00:00', kind: 'SIMULATED', text: 'Fictional web worker W-07 receives a multipart request. Application code has not started.' },
      { time: 'T+00:01', kind: 'SIMULATED', text: 'The teaching model records an illustrative memory-exhaustion interruption during early request handling.' },
      { time: 'T+00:02', kind: 'SIMULATED', text: 'A request-internal state marker is labelled incomplete in this synthetic trace. No real pointer or memory address exists.' },
      { time: 'T+00:03', kind: 'SIMULATED', text: 'The fictional cleanup stage encounters the invalid-state marker. The exercise records a runtime-integrity concern only.' },
      { time: 'T+00:04', kind: 'ANALYSIS', text: 'CVE-2026-109618 is the OOM-corruption advisory. The PHP project rates the issue critical and describes RCE impact; this interface performs neither memory disclosure nor execution.' }
    ]
  },
  'cve-2026-109619': {
    title: 'CVE-2026-109619 · stale global state path',
    result: 'Training interpretation: the PHP advisory describes request-owned state retained by a worker after its backing request memory is released. A later early consumer may encounter stale state before normal initialization. No real state is retained by this simulator.',
    events: [
      { time: 'T+00:00', kind: 'SIMULATED', text: 'Fictional request A runs on worker W-12 and publishes a request-owned state marker.' },
      { time: 'T+00:01', kind: 'SIMULATED', text: 'A fatal interruption is recorded before the modelled cleanup/reset point.' },
      { time: 'T+00:02', kind: 'SIMULATED', text: 'Request A ends. The storyboard marks its synthetic state as released while the worker label remains available for the next scene.' },
      { time: 'T+00:03', kind: 'SIMULATED', text: 'Fictional request B is assigned the same worker label. The timeline places an early session upload-progress consumer before ordinary request initialization.' },
      { time: 'T+00:04', kind: 'ANALYSIS', text: 'CVE-2026-109619 is the stale-global-state advisory. Same-worker reuse is part of the described lifecycle. This interface does not retain a pointer or execute a command.' }
    ]
  }
};

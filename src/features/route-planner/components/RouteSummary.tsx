import type { RoutePlan } from '../types'

interface RouteSummaryProps {
  plan: RoutePlan
}

export function RouteSummary({ plan }: RouteSummaryProps) {
  if (plan.unreachable) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        No valid route exists — one or more required categories are not reachable from the start point. Check for
        walls blocking the path in the editor.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {plan.unresolvedLabels.length > 0 && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          No marker found for: {plan.unresolvedLabels.join(', ')} — add this category in the editor or fix the
          spelling.
        </div>
      )}
      {plan.stops.length === 0 ? (
        <p className="text-sm text-muted-foreground">No resolvable categories in the shopping list yet.</p>
      ) : (
        <>
          <ol className="flex flex-col gap-1 text-sm">
            <li className="text-muted-foreground">Start</li>
            {plan.stops.map((stop, i) => (
              <li key={`${stop.label}-${i}`}>
                {i + 1}. {stop.label}
                <span className="ml-1 text-muted-foreground">(+{plan.legDistances[i]})</span>
                <ul className="ml-4 list-disc text-muted-foreground">
                  {stop.items.map((item) => (
                    <li key={item.id}>{item.name.trim() || '(unnamed item)'}</li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="text-muted-foreground">
              End
              <span className="ml-1">(+{plan.legDistances[plan.legDistances.length - 1]})</span>
            </li>
          </ol>
          <p className="text-sm font-medium">Total distance: {plan.totalDistance}</p>
        </>
      )}
    </div>
  )
}

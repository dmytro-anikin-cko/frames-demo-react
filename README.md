Understanding State and Refs in React
State in React:

State in React is used to store data that can change over time.
When you update state using setState, React schedules a re-render. This means the component will re-render to reflect the updated state.
However, state updates in React are asynchronous. This means when you call setState, the new state value isn't immediately available right after the call. React batches these updates and re-renders the component afterward.
Callbacks and Asynchronous Nature:

When you have a callback function, like the one provided to Frames.submitCard(), React might not have updated the state by the time the callback is executed.
This is why, in your case, the amount was still null when accessed inside the cardTokenized callback.
Using Refs to Solve This Issue
Refs in React:

useRef creates a mutable object which holds a .current property.
The value of .current does not cause re-renders when it changes. This makes it ideal for storing values that change over time but do not require a component update.
Immediate Updates:

Unlike state, updating a ref value (ref.current = newValue) happens immediately.
The value stored in a ref is always up-to-date and can be accessed immediately without waiting for a re-render.
How It Worked in Your Case
State Update Lag:

When you changed the amount using setAmount, React didn't immediately reflect this new value in the cardTokenized callback due to its asynchronous nature.
Hence, the amount was still null in the cardTokenized callback.
Using Refs for Immediate Access:

By using useRef, you stored the amount and cardholder in refs.
Whenever the state changed, you also updated the refs (amountRef.current = amount).
Since ref updates are immediate, the cardTokenized callback could access the latest value directly from the refs.
Visual Representation
Here's a simple visual to understand this:

State Update: setAmount(newAmount) -> (schedules re-render) -> (new state available after re-render)
Ref Update: amountRef.current = newAmount -> (immediate update, no re-render)
So, when Frames.submitCard() called the cardTokenized callback, the refs had the latest values because they were updated immediately, unlike state.

Summary
State: Great for managing data that affects rendering. Updates are asynchronous.
Refs: Great for storing mutable data that doesn't trigger re-renders. Updates are immediate.
Using refs, you ensured that your callback always had access to the most recent values without waiting for React's state update cycle. This immediate access to updated values is why the ref method worked for you.


The problem lies in the timing of the state update relative to when the cardTokenized callback is invoked. Let's dive deeper into this to understand why the state might not be available in the callback.

Understanding the Issue
State Update Mechanism:

When you update the state (e.g., setAmount), React schedules a re-render.
The re-render updates the DOM and all component instances.
However, this update process is asynchronous and might not have completed by the time Frames.submitCard() triggers the cardTokenized callback.
Callback Timing:

When Frames.submitCard() is called, it triggers the cardTokenized callback as soon as it has the tokenized data.
This callback might be executed before the state update from setAmount has completed and the component has re-rendered with the new state.
Why Refs Work
Refs provide an immediate and mutable reference to a value that does not depend on the component's render cycle. Therefore, they can give you the latest value at any point in time, including within callbacks that might be triggered before the state update has completed.

The Scenario:
State Update: You change the amount using an input, which triggers setAmount(newAmount).
State Re-render: React schedules a re-render with the new amount.
Submit Card: You click the "PAY" button, which calls Frames.submitCard().
Callback Execution: Frames.submitCard() triggers cardTokenized, but at this point, the state update might not have completed, so the amount is still the old value.
The Ref Solution:
Using useRef ensures that the latest value of amount is available even if the state update has not yet completed.

Ensuring the Correct Value in State:
To ensure you always have the correct value, you should update both the state and the ref whenever the input changes. This way, even if the callback happens before the state update completes, the ref will always have the latest value.
import * as Type from './Type';

/**
 * The `Optional` type represents a value (of any type) that potentially does
 * not exist. Any `Optional<T>` can either be a `Some<T>` (in which case the
 * value does exist) or a `None` (in which case the value does not exist). This
 * module defines a whole lot of FP-inspired utility functions for dealing with
 * `Optional` objects.
 *
 * Comparison with null or undefined:
 * - We don't get fancy null coalescing operators with `Optional`
 * - We do get fancy helper functions with `Optional`
 * - `Optional` support nesting, and allow for the type to still be nullable (or
 * another `Optional`)
 * - There is no option to turn off strict-optional-checks like there is for
 * strict-null-checks
 */
export class Optional<T> {
  private readonly tag: boolean;
  private readonly value?: T;

  // Sneaky optimisation: every instance of Optional.none is identical, so just
  // reuse the same object
  private static singletonNone = new Optional<any>(false);

  // The internal representation has a `tag` and a `value`, but both are
  // private: able to be console.logged, but not able to be accessed by code
  private constructor(tag: boolean, value?: T) {
    this.tag = tag;
    this.value = value;
  }

  // --- Identities ---

  /**
   * Creates a new `Optional<T>` that **does** contain a value.
   */
  public static some<T>(this: void, value: T): Optional<T> {
    return new Optional(true, value);
  }

  /**
   * Create a new `Optional<T>` that **does not** contain a value. `T` can be
   * any type because we don't actually have a `T`.
   */
  public static none<T = never>(this: void): Optional<T> {
    return Optional.singletonNone;
  }

  /**
   * Perform a transform on an `Optional` type. Regardless of whether this
   * `Optional` contains a value or not, `fold` will return a value of type `U`.
   * If this `Optional` does not contain a value, the `U` will be created by
   * calling `onNone`. If this `Optional` does contain a value, the `U` will be
   * created by calling `onSome`.
   *
   * For the FP enthusiasts in the room, this function:
   * 1. Could be used to implement all of the functions below
   * 2. Forms a catamorphism
   */
  public fold<U>(onNone: () => U, onSome: (value: T) => U): U {
    if (this.tag) {
      return onSome(this.value as T);
    } else {
      return onNone();
    }
  }

  // --- Functor (name stolen from Haskell / maths) ---

  /**
   * Perform a transform on an `Optional` object, **if** there is a value. If
   * you provide a function to turn a T into a U, this is the function you use
   * to turn an `Optional<T>` into an `Optional<U>`. If this **does** contain
   * a value then the output will also contain a value (that value being the
   * output of `mapper(this.value)`), and if this **does not** contain a value
   * then neither will the output.
   */
  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.tag) {
      return Optional.some(mapper(this.value as T));
    } else {
      return Optional.none();
    }
  }

  // --- Monad (name stolen from Haskell / maths) ---

  // --- Traversable (name stolen from Haskell / maths) ---

  // --- Getters ---

  /**
   * Get the value out of the inside of the `Optional` object, using a default
   * `replacement` value if the provided `Optional` object does not contain a
   * value.
   */
  public getOr<U = T>(replacement: U): T | U {
    return this.tag ? this.value as T : replacement;
  }

  // --- Interop with null and undefined ---

  /**
   * Creates an `Optional` value from a nullable (or undefined-able) input.
   * Null, or undefined, is converted to `None`, and anything else is converted
   * to `Some`.
   */
  public static from<T>(this: void, value: T | null | undefined): Optional<NonNullable<T>> {
    return Type.isNonNullable(value) ? Optional.some(value) : Optional.none();
  }

  // --- Utilities ---

  /**
   * If the `Optional` contains a value, perform an action on that value.
   * Unlike the rest of the methods on this type, `.each` has side-effects. If
   * you want to transform an `Optional<T>` **into** something, then this is not
   * the method for you. If you want to use an `Optional<T>` to **do**
   * something, then this is the method for you - provided you're okay with not
   * doing anything in the case where the `Optional` doesn't have a value inside
   * it. If you're not sure whether your use-case fits into transforming
   * **into** something or **doing** something, check whether it has a return
   * value. If it does, you should be performing a transform.
   */
  public each(worker: (value: T) => void): void {
    if (this.tag) {
      worker(this.value as T);
    }
  }

  /**
   * Turn the `Optional` object into a string for debugging or printing. Not
   * recommended for production code, but good for debugging. Also note that
   * these days an `Optional` object can be logged to the console directly, and
   * its inner value (if it exists) will be visible.
   */
  public toString(): string {
    return this.tag ? `some(${this.value})` : 'none()';
  }
}

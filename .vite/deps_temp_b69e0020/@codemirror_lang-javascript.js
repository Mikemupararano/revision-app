import {
  DefaultBufferLength,
  EditorSelection,
  EditorView,
  IterMode,
  LRLanguage,
  LanguageSupport,
  NodeProp,
  NodeSet,
  NodeType,
  NodeWeakMap,
  Parser,
  Tree,
  completeFromList,
  continuedIndent,
  defineLanguageFacet,
  delimitedIndent,
  flatIndent,
  foldInside,
  foldNodeProp,
  ifNotIn,
  indentNodeProp,
  snippetCompletion,
  styleTags,
  sublanguageProp,
  syntaxTree,
  tags
} from "./chunk-X2I7ZJWY.js";
import "./chunk-5WWUZCGV.js";

// node_modules/@lezer/lr/dist/index.js
var Stack = class _Stack {
  /**
  @internal
  */
  constructor(p, stack, state, reducePos, pos, score, buffer, bufferBase, curContext, lookAhead = 0, parent) {
    this.p = p;
    this.stack = stack;
    this.state = state;
    this.reducePos = reducePos;
    this.pos = pos;
    this.score = score;
    this.buffer = buffer;
    this.bufferBase = bufferBase;
    this.curContext = curContext;
    this.lookAhead = lookAhead;
    this.parent = parent;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((_, i) => i % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(p, state, pos = 0) {
    let cx = p.parser.context;
    return new _Stack(p, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(state, start) {
    this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
    this.state = state;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(action) {
    var _a;
    let depth = action >> 19, type = action & 65535;
    let { parser: parser2 } = this.p;
    let dPrec = parser2.dynamicPrecedence(type);
    if (dPrec)
      this.score += dPrec;
    if (depth == 0) {
      this.pushState(parser2.getGoto(this.state, type, true), this.reducePos);
      if (type < parser2.minRepeatTerm)
        this.storeNode(type, this.reducePos, this.reducePos, 4, true);
      this.reduceContext(type, this.reducePos);
      return;
    }
    let base = this.stack.length - (depth - 1) * 3 - (action & 262144 ? 6 : 0);
    let start = base ? this.stack[base - 2] : this.p.ranges[0].from, size = this.reducePos - start;
    if (size >= 2e3 && !((_a = this.p.parser.nodeSet.types[type]) === null || _a === void 0 ? void 0 : _a.isAnonymous)) {
      if (start == this.p.lastBigReductionStart) {
        this.p.bigReductionCount++;
        this.p.lastBigReductionSize = size;
      } else if (this.p.lastBigReductionSize < size) {
        this.p.bigReductionCount = 1;
        this.p.lastBigReductionStart = start;
        this.p.lastBigReductionSize = size;
      }
    }
    let bufferBase = base ? this.stack[base - 1] : 0, count = this.bufferBase + this.buffer.length - bufferBase;
    if (type < parser2.minRepeatTerm || action & 131072) {
      let pos = parser2.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(type, start, pos, count + 4, true);
    }
    if (action & 262144) {
      this.state = this.stack[base];
    } else {
      let baseStateID = this.stack[base - 3];
      this.state = parser2.getGoto(baseStateID, type, true);
    }
    while (this.stack.length > base)
      this.stack.pop();
    this.reduceContext(type, start);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(term, start, end, size = 4, isReduce = false) {
    if (term == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let cur = this, top = this.buffer.length;
      if (top == 0 && cur.parent) {
        top = cur.bufferBase - cur.parent.bufferBase;
        cur = cur.parent;
      }
      if (top > 0 && cur.buffer[top - 4] == 0 && cur.buffer[top - 1] > -1) {
        if (start == end)
          return;
        if (cur.buffer[top - 2] >= start) {
          cur.buffer[top - 2] = end;
          return;
        }
      }
    }
    if (!isReduce || this.pos == end) {
      this.buffer.push(term, start, end, size);
    } else {
      let index = this.buffer.length;
      if (index > 0 && this.buffer[index - 4] != 0)
        while (index > 0 && this.buffer[index - 2] > end) {
          this.buffer[index] = this.buffer[index - 4];
          this.buffer[index + 1] = this.buffer[index - 3];
          this.buffer[index + 2] = this.buffer[index - 2];
          this.buffer[index + 3] = this.buffer[index - 1];
          index -= 4;
          if (size > 4)
            size -= 4;
        }
      this.buffer[index] = term;
      this.buffer[index + 1] = start;
      this.buffer[index + 2] = end;
      this.buffer[index + 3] = size;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(action, type, start, end) {
    if (action & 131072) {
      this.pushState(action & 65535, this.pos);
    } else if ((action & 262144) == 0) {
      let nextState = action, { parser: parser2 } = this.p;
      if (end > this.pos || type <= parser2.maxNode) {
        this.pos = end;
        if (!parser2.stateFlag(
          nextState,
          1
          /* StateFlag.Skipped */
        ))
          this.reducePos = end;
      }
      this.pushState(nextState, start);
      this.shiftContext(type, start);
      if (type <= parser2.maxNode)
        this.buffer.push(type, start, end, 4);
    } else {
      this.pos = end;
      this.shiftContext(type, start);
      if (type <= this.p.parser.maxNode)
        this.buffer.push(type, start, end, 4);
    }
  }
  // Apply an action
  /**
  @internal
  */
  apply(action, next, nextStart, nextEnd) {
    if (action & 65536)
      this.reduce(action);
    else
      this.shift(action, next, nextStart, nextEnd);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(value, next) {
    let index = this.p.reused.length - 1;
    if (index < 0 || this.p.reused[index] != value) {
      this.p.reused.push(value);
      index++;
    }
    let start = this.pos;
    this.reducePos = this.pos = start + value.length;
    this.pushState(next, start);
    this.buffer.push(
      index,
      start,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    );
    if (this.curContext)
      this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this, this.p.stream.reset(this.pos - value.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let parent = this;
    let off = parent.buffer.length;
    while (off > 0 && parent.buffer[off - 2] > parent.reducePos)
      off -= 4;
    let buffer = parent.buffer.slice(off), base = parent.bufferBase + off;
    while (parent && base == parent.bufferBase)
      parent = parent.parent;
    return new _Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base, this.curContext, this.lookAhead, parent);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(next, nextEnd) {
    let isNode = next <= this.p.parser.maxNode;
    if (isNode)
      this.storeNode(next, this.pos, nextEnd, 4);
    this.storeNode(0, this.pos, nextEnd, isNode ? 8 : 4);
    this.pos = this.reducePos = nextEnd;
    this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(term) {
    for (let sim = new SimulatedStack(this); ; ) {
      let action = this.p.parser.stateSlot(
        sim.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(sim.state, term);
      if (action == 0)
        return false;
      if ((action & 65536) == 0)
        return true;
      sim.reduce(action);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(next) {
    if (this.stack.length >= 300)
      return [];
    let nextStates = this.p.parser.nextStates(this.state);
    if (nextStates.length > 4 << 1 || this.stack.length >= 120) {
      let best = [];
      for (let i = 0, s; i < nextStates.length; i += 2) {
        if ((s = nextStates[i + 1]) != this.state && this.p.parser.hasAction(s, next))
          best.push(nextStates[i], s);
      }
      if (this.stack.length < 120)
        for (let i = 0; best.length < 4 << 1 && i < nextStates.length; i += 2) {
          let s = nextStates[i + 1];
          if (!best.some((v, i2) => i2 & 1 && v == s))
            best.push(nextStates[i], s);
        }
      nextStates = best;
    }
    let result = [];
    for (let i = 0; i < nextStates.length && result.length < 4; i += 2) {
      let s = nextStates[i + 1];
      if (s == this.state)
        continue;
      let stack = this.split();
      stack.pushState(s, this.pos);
      stack.storeNode(0, stack.pos, stack.pos, 4, true);
      stack.shiftContext(nextStates[i], this.pos);
      stack.reducePos = this.pos;
      stack.score -= 200;
      result.push(stack);
    }
    return result;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: parser2 } = this.p;
    let reduce = parser2.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((reduce & 65536) == 0)
      return false;
    if (!parser2.validAction(this.state, reduce)) {
      let depth = reduce >> 19, term = reduce & 65535;
      let target = this.stack.length - depth * 3;
      if (target < 0 || parser2.getGoto(this.stack[target], term, false) < 0) {
        let backup = this.findForcedReduction();
        if (backup == null)
          return false;
        reduce = backup;
      }
      this.storeNode(0, this.pos, this.pos, 4, true);
      this.score -= 100;
    }
    this.reducePos = this.pos;
    this.reduce(reduce);
    return true;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: parser2 } = this.p, seen = [];
    let explore = (state, depth) => {
      if (seen.includes(state))
        return;
      seen.push(state);
      return parser2.allActions(state, (action) => {
        if (action & (262144 | 131072))
          ;
        else if (action & 65536) {
          let rDepth = (action >> 19) - depth;
          if (rDepth > 1) {
            let term = action & 65535, target = this.stack.length - rDepth * 3;
            if (target >= 0 && parser2.getGoto(this.stack[target], term, false) >= 0)
              return rDepth << 19 | 65536 | term;
          }
        } else {
          let found = explore(action, depth + 1);
          if (found != null)
            return found;
        }
      });
    };
    return explore(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    while (!this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    )) {
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, true);
        break;
      }
    }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return false;
    let { parser: parser2 } = this.p;
    return parser2.data[parser2.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !parser2.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, true);
    this.state = this.stack[0];
    this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(other) {
    if (this.state != other.state || this.stack.length != other.stack.length)
      return false;
    for (let i = 0; i < this.stack.length; i += 3)
      if (this.stack[i] != other.stack[i])
        return false;
    return true;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(dialectID) {
    return this.p.parser.dialect.flags[dialectID];
  }
  shiftContext(term, start) {
    if (this.curContext)
      this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this, this.p.stream.reset(start)));
  }
  reduceContext(term, start) {
    if (this.curContext)
      this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this, this.p.stream.reset(start)));
  }
  /**
  @internal
  */
  emitContext() {
    let last = this.buffer.length - 1;
    if (last < 0 || this.buffer[last] != -3)
      this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let last = this.buffer.length - 1;
    if (last < 0 || this.buffer[last] != -4)
      this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(context) {
    if (context != this.curContext.context) {
      let newCx = new StackContext(this.curContext.tracker, context);
      if (newCx.hash != this.curContext.hash)
        this.emitContext();
      this.curContext = newCx;
    }
  }
  /**
  @internal
  */
  setLookAhead(lookAhead) {
    if (lookAhead > this.lookAhead) {
      this.emitLookAhead();
      this.lookAhead = lookAhead;
    }
  }
  /**
  @internal
  */
  close() {
    if (this.curContext && this.curContext.tracker.strict)
      this.emitContext();
    if (this.lookAhead > 0)
      this.emitLookAhead();
  }
};
var StackContext = class {
  constructor(tracker, context) {
    this.tracker = tracker;
    this.context = context;
    this.hash = tracker.strict ? tracker.hash(context) : 0;
  }
};
var SimulatedStack = class {
  constructor(start) {
    this.start = start;
    this.state = start.state;
    this.stack = start.stack;
    this.base = this.stack.length;
  }
  reduce(action) {
    let term = action & 65535, depth = action >> 19;
    if (depth == 0) {
      if (this.stack == this.start.stack)
        this.stack = this.stack.slice();
      this.stack.push(this.state, 0, 0);
      this.base += 3;
    } else {
      this.base -= (depth - 1) * 3;
    }
    let goto = this.start.p.parser.getGoto(this.stack[this.base - 3], term, true);
    this.state = goto;
  }
};
var StackBufferCursor = class _StackBufferCursor {
  constructor(stack, pos, index) {
    this.stack = stack;
    this.pos = pos;
    this.index = index;
    this.buffer = stack.buffer;
    if (this.index == 0)
      this.maybeNext();
  }
  static create(stack, pos = stack.bufferBase + stack.buffer.length) {
    return new _StackBufferCursor(stack, pos, pos - stack.bufferBase);
  }
  maybeNext() {
    let next = this.stack.parent;
    if (next != null) {
      this.index = this.stack.bufferBase - next.bufferBase;
      this.stack = next;
      this.buffer = next.buffer;
    }
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4;
    this.pos -= 4;
    if (this.index == 0)
      this.maybeNext();
  }
  fork() {
    return new _StackBufferCursor(this.stack, this.pos, this.index);
  }
};
function decodeArray(input, Type = Uint16Array) {
  if (typeof input != "string")
    return input;
  let array = null;
  for (let pos = 0, out = 0; pos < input.length; ) {
    let value = 0;
    for (; ; ) {
      let next = input.charCodeAt(pos++), stop = false;
      if (next == 126) {
        value = 65535;
        break;
      }
      if (next >= 92)
        next--;
      if (next >= 34)
        next--;
      let digit = next - 32;
      if (digit >= 46) {
        digit -= 46;
        stop = true;
      }
      value += digit;
      if (stop)
        break;
      value *= 46;
    }
    if (array)
      array[out++] = value;
    else
      array = new Type(value);
  }
  return array;
}
var CachedToken = class {
  constructor() {
    this.start = -1;
    this.value = -1;
    this.end = -1;
    this.extended = -1;
    this.lookAhead = 0;
    this.mask = 0;
    this.context = 0;
  }
};
var nullToken = new CachedToken();
var InputStream = class {
  /**
  @internal
  */
  constructor(input, ranges) {
    this.input = input;
    this.ranges = ranges;
    this.chunk = "";
    this.chunkOff = 0;
    this.chunk2 = "";
    this.chunk2Pos = 0;
    this.next = -1;
    this.token = nullToken;
    this.rangeIndex = 0;
    this.pos = this.chunkPos = ranges[0].from;
    this.range = ranges[0];
    this.end = ranges[ranges.length - 1].to;
    this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(offset, assoc) {
    let range = this.range, index = this.rangeIndex;
    let pos = this.pos + offset;
    while (pos < range.from) {
      if (!index)
        return null;
      let next = this.ranges[--index];
      pos -= range.from - next.to;
      range = next;
    }
    while (assoc < 0 ? pos > range.to : pos >= range.to) {
      if (index == this.ranges.length - 1)
        return null;
      let next = this.ranges[++index];
      pos += next.from - range.to;
      range = next;
    }
    return pos;
  }
  /**
  @internal
  */
  clipPos(pos) {
    if (pos >= this.range.from && pos < this.range.to)
      return pos;
    for (let range of this.ranges)
      if (range.to > pos)
        return Math.max(pos, range.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(offset) {
    let idx = this.chunkOff + offset, pos, result;
    if (idx >= 0 && idx < this.chunk.length) {
      pos = this.pos + offset;
      result = this.chunk.charCodeAt(idx);
    } else {
      let resolved = this.resolveOffset(offset, 1);
      if (resolved == null)
        return -1;
      pos = resolved;
      if (pos >= this.chunk2Pos && pos < this.chunk2Pos + this.chunk2.length) {
        result = this.chunk2.charCodeAt(pos - this.chunk2Pos);
      } else {
        let i = this.rangeIndex, range = this.range;
        while (range.to <= pos)
          range = this.ranges[++i];
        this.chunk2 = this.input.chunk(this.chunk2Pos = pos);
        if (pos + this.chunk2.length > range.to)
          this.chunk2 = this.chunk2.slice(0, range.to - pos);
        result = this.chunk2.charCodeAt(0);
      }
    }
    if (pos >= this.token.lookAhead)
      this.token.lookAhead = pos + 1;
    return result;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(token, endOffset = 0) {
    let end = endOffset ? this.resolveOffset(endOffset, -1) : this.pos;
    if (end == null || end < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = token;
    this.token.end = end;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(token, endPos) {
    this.token.value = token;
    this.token.end = endPos;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk, chunkPos } = this;
      this.chunk = this.chunk2;
      this.chunkPos = this.chunk2Pos;
      this.chunk2 = chunk;
      this.chunk2Pos = chunkPos;
      this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk;
      this.chunk2Pos = this.chunkPos;
      let nextChunk = this.input.chunk(this.pos);
      let end = this.pos + nextChunk.length;
      this.chunk = end > this.range.to ? nextChunk.slice(0, this.range.to - this.pos) : nextChunk;
      this.chunkPos = this.pos;
      this.chunkOff = 0;
    }
  }
  readNext() {
    if (this.chunkOff >= this.chunk.length) {
      this.getChunk();
      if (this.chunkOff == this.chunk.length)
        return this.next = -1;
    }
    return this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(n = 1) {
    this.chunkOff += n;
    while (this.pos + n >= this.range.to) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      n -= this.range.to - this.pos;
      this.range = this.ranges[++this.rangeIndex];
      this.pos = this.range.from;
    }
    this.pos += n;
    if (this.pos >= this.token.lookAhead)
      this.token.lookAhead = this.pos + 1;
    return this.readNext();
  }
  setDone() {
    this.pos = this.chunkPos = this.end;
    this.range = this.ranges[this.rangeIndex = this.ranges.length - 1];
    this.chunk = "";
    return this.next = -1;
  }
  /**
  @internal
  */
  reset(pos, token) {
    if (token) {
      this.token = token;
      token.start = pos;
      token.lookAhead = pos + 1;
      token.value = token.extended = -1;
    } else {
      this.token = nullToken;
    }
    if (this.pos != pos) {
      this.pos = pos;
      if (pos == this.end) {
        this.setDone();
        return this;
      }
      while (pos < this.range.from)
        this.range = this.ranges[--this.rangeIndex];
      while (pos >= this.range.to)
        this.range = this.ranges[++this.rangeIndex];
      if (pos >= this.chunkPos && pos < this.chunkPos + this.chunk.length) {
        this.chunkOff = pos - this.chunkPos;
      } else {
        this.chunk = "";
        this.chunkOff = 0;
      }
      this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(from, to) {
    if (from >= this.chunkPos && to <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(from - this.chunkPos, to - this.chunkPos);
    if (from >= this.chunk2Pos && to <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(from - this.chunk2Pos, to - this.chunk2Pos);
    if (from >= this.range.from && to <= this.range.to)
      return this.input.read(from, to);
    let result = "";
    for (let r of this.ranges) {
      if (r.from >= to)
        break;
      if (r.to > from)
        result += this.input.read(Math.max(r.from, from), Math.min(r.to, to));
    }
    return result;
  }
};
var TokenGroup = class {
  constructor(data, id2) {
    this.data = data;
    this.id = id2;
  }
  token(input, stack) {
    let { parser: parser2 } = stack.p;
    readToken(this.data, input, stack, this.id, parser2.data, parser2.tokenPrecTable);
  }
};
TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
var LocalTokenGroup = class {
  constructor(data, precTable, elseToken) {
    this.precTable = precTable;
    this.elseToken = elseToken;
    this.data = typeof data == "string" ? decodeArray(data) : data;
  }
  token(input, stack) {
    let start = input.pos, skipped = 0;
    for (; ; ) {
      let atEof = input.next < 0, nextPos = input.resolveOffset(1, 1);
      readToken(this.data, input, stack, 0, this.data, this.precTable);
      if (input.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (!atEof)
        skipped++;
      if (nextPos == null)
        break;
      input.reset(nextPos, input.token);
    }
    if (skipped) {
      input.reset(start, input.token);
      input.acceptToken(this.elseToken, skipped);
    }
  }
};
LocalTokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
var ExternalTokenizer = class {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(token, options = {}) {
    this.token = token;
    this.contextual = !!options.contextual;
    this.fallback = !!options.fallback;
    this.extend = !!options.extend;
  }
};
function readToken(data, input, stack, group, precTable, precOffset) {
  let state = 0, groupMask = 1 << group, { dialect } = stack.p.parser;
  scan:
    for (; ; ) {
      if ((groupMask & data[state]) == 0)
        break;
      let accEnd = data[state + 1];
      for (let i = state + 3; i < accEnd; i += 2)
        if ((data[i + 1] & groupMask) > 0) {
          let term = data[i];
          if (dialect.allows(term) && (input.token.value == -1 || input.token.value == term || overrides(term, input.token.value, precTable, precOffset))) {
            input.acceptToken(term);
            break;
          }
        }
      let next = input.next, low = 0, high = data[state + 2];
      if (input.next < 0 && high > low && data[accEnd + high * 3 - 3] == 65535) {
        state = data[accEnd + high * 3 - 1];
        continue scan;
      }
      for (; low < high; ) {
        let mid = low + high >> 1;
        let index = accEnd + mid + (mid << 1);
        let from = data[index], to = data[index + 1] || 65536;
        if (next < from)
          high = mid;
        else if (next >= to)
          low = mid + 1;
        else {
          state = data[index + 2];
          input.advance();
          continue scan;
        }
      }
      break;
    }
}
function findOffset(data, start, term) {
  for (let i = start, next; (next = data[i]) != 65535; i++)
    if (next == term)
      return i - start;
  return -1;
}
function overrides(token, prev, tableData, tableOffset) {
  let iPrev = findOffset(tableData, tableOffset, prev);
  return iPrev < 0 || findOffset(tableData, tableOffset, token) < iPrev;
}
var verbose = typeof process != "undefined" && process.env && /\bparse\b/.test(process.env.LOG);
var stackIDs = null;
function cutAt(tree, pos, side) {
  let cursor = tree.cursor(IterMode.IncludeAnonymous);
  cursor.moveTo(pos);
  for (; ; ) {
    if (!(side < 0 ? cursor.childBefore(pos) : cursor.childAfter(pos)))
      for (; ; ) {
        if ((side < 0 ? cursor.to < pos : cursor.from > pos) && !cursor.type.isError)
          return side < 0 ? Math.max(0, Math.min(
            cursor.to - 1,
            pos - 25
            /* Safety.Margin */
          )) : Math.min(tree.length, Math.max(
            cursor.from + 1,
            pos + 25
            /* Safety.Margin */
          ));
        if (side < 0 ? cursor.prevSibling() : cursor.nextSibling())
          break;
        if (!cursor.parent())
          return side < 0 ? 0 : tree.length;
      }
  }
}
var FragmentCursor = class {
  constructor(fragments, nodeSet) {
    this.fragments = fragments;
    this.nodeSet = nodeSet;
    this.i = 0;
    this.fragment = null;
    this.safeFrom = -1;
    this.safeTo = -1;
    this.trees = [];
    this.start = [];
    this.index = [];
    this.nextFragment();
  }
  nextFragment() {
    let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (fr) {
      this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
      this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;
      while (this.trees.length) {
        this.trees.pop();
        this.start.pop();
        this.index.pop();
      }
      this.trees.push(fr.tree);
      this.start.push(-fr.offset);
      this.index.push(0);
      this.nextStart = this.safeFrom;
    } else {
      this.nextStart = 1e9;
    }
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(pos) {
    if (pos < this.nextStart)
      return null;
    while (this.fragment && this.safeTo <= pos)
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let last = this.trees.length - 1;
      if (last < 0) {
        this.nextFragment();
        return null;
      }
      let top = this.trees[last], index = this.index[last];
      if (index == top.children.length) {
        this.trees.pop();
        this.start.pop();
        this.index.pop();
        continue;
      }
      let next = top.children[index];
      let start = this.start[last] + top.positions[index];
      if (start > pos) {
        this.nextStart = start;
        return null;
      }
      if (next instanceof Tree) {
        if (start == pos) {
          if (start < this.safeFrom)
            return null;
          let end = start + next.length;
          if (end <= this.safeTo) {
            let lookAhead = next.prop(NodeProp.lookAhead);
            if (!lookAhead || end + lookAhead < this.fragment.to)
              return next;
          }
        }
        this.index[last]++;
        if (start + next.length >= Math.max(this.safeFrom, pos)) {
          this.trees.push(next);
          this.start.push(start);
          this.index.push(0);
        }
      } else {
        this.index[last]++;
        this.nextStart = start + next.length;
      }
    }
  }
};
var TokenCache = class {
  constructor(parser2, stream) {
    this.stream = stream;
    this.tokens = [];
    this.mainToken = null;
    this.actions = [];
    this.tokens = parser2.tokenizers.map((_) => new CachedToken());
  }
  getActions(stack) {
    let actionIndex = 0;
    let main = null;
    let { parser: parser2 } = stack.p, { tokenizers } = parser2;
    let mask = parser2.stateSlot(
      stack.state,
      3
      /* ParseState.TokenizerMask */
    );
    let context = stack.curContext ? stack.curContext.hash : 0;
    let lookAhead = 0;
    for (let i = 0; i < tokenizers.length; i++) {
      if ((1 << i & mask) == 0)
        continue;
      let tokenizer = tokenizers[i], token = this.tokens[i];
      if (main && !tokenizer.fallback)
        continue;
      if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
        this.updateCachedToken(token, tokenizer, stack);
        token.mask = mask;
        token.context = context;
      }
      if (token.lookAhead > token.end + 25)
        lookAhead = Math.max(token.lookAhead, lookAhead);
      if (token.value != 0) {
        let startIndex = actionIndex;
        if (token.extended > -1)
          actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
        actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
        if (!tokenizer.extend) {
          main = token;
          if (actionIndex > startIndex)
            break;
        }
      }
    }
    while (this.actions.length > actionIndex)
      this.actions.pop();
    if (lookAhead)
      stack.setLookAhead(lookAhead);
    if (!main && stack.pos == this.stream.end) {
      main = new CachedToken();
      main.value = stack.p.parser.eofTerm;
      main.start = main.end = stack.pos;
      actionIndex = this.addActions(stack, main.value, main.end, actionIndex);
    }
    this.mainToken = main;
    return this.actions;
  }
  getMainToken(stack) {
    if (this.mainToken)
      return this.mainToken;
    let main = new CachedToken(), { pos, p } = stack;
    main.start = pos;
    main.end = Math.min(pos + 1, p.stream.end);
    main.value = pos == p.stream.end ? p.parser.eofTerm : 0;
    return main;
  }
  updateCachedToken(token, tokenizer, stack) {
    let start = this.stream.clipPos(stack.pos);
    tokenizer.token(this.stream.reset(start, token), stack);
    if (token.value > -1) {
      let { parser: parser2 } = stack.p;
      for (let i = 0; i < parser2.specialized.length; i++)
        if (parser2.specialized[i] == token.value) {
          let result = parser2.specializers[i](this.stream.read(token.start, token.end), stack);
          if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
            if ((result & 1) == 0)
              token.value = result >> 1;
            else
              token.extended = result >> 1;
            break;
          }
        }
    } else {
      token.value = 0;
      token.end = this.stream.clipPos(start + 1);
    }
  }
  putAction(action, token, end, index) {
    for (let i = 0; i < index; i += 3)
      if (this.actions[i] == action)
        return index;
    this.actions[index++] = action;
    this.actions[index++] = token;
    this.actions[index++] = end;
    return index;
  }
  addActions(stack, token, end, index) {
    let { state } = stack, { parser: parser2 } = stack.p, { data } = parser2;
    for (let set = 0; set < 2; set++) {
      for (let i = parser2.stateSlot(
        state,
        set ? 2 : 1
        /* ParseState.Actions */
      ); ; i += 3) {
        if (data[i] == 65535) {
          if (data[i + 1] == 1) {
            i = pair(data, i + 2);
          } else {
            if (index == 0 && data[i + 1] == 2)
              index = this.putAction(pair(data, i + 2), token, end, index);
            break;
          }
        }
        if (data[i] == token)
          index = this.putAction(pair(data, i + 1), token, end, index);
      }
    }
    return index;
  }
};
var Parse = class {
  constructor(parser2, input, fragments, ranges) {
    this.parser = parser2;
    this.input = input;
    this.ranges = ranges;
    this.recovering = 0;
    this.nextStackID = 9812;
    this.minStackPos = 0;
    this.reused = [];
    this.stoppedAt = null;
    this.lastBigReductionStart = -1;
    this.lastBigReductionSize = 0;
    this.bigReductionCount = 0;
    this.stream = new InputStream(input, ranges);
    this.tokens = new TokenCache(parser2, this.stream);
    this.topTerm = parser2.top[1];
    let { from } = ranges[0];
    this.stacks = [Stack.start(this, parser2.top[0], from)];
    this.fragments = fragments.length && this.stream.end - from > parser2.bufferLength * 4 ? new FragmentCursor(fragments, parser2.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let stacks = this.stacks, pos = this.minStackPos;
    let newStacks = this.stacks = [];
    let stopped, stoppedTokens;
    if (this.bigReductionCount > 300 && stacks.length == 1) {
      let [s] = stacks;
      while (s.forceReduce() && s.stack.length && s.stack[s.stack.length - 2] >= this.lastBigReductionStart) {
      }
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let i = 0; i < stacks.length; i++) {
      let stack = stacks[i];
      for (; ; ) {
        this.tokens.mainToken = null;
        if (stack.pos > pos) {
          newStacks.push(stack);
        } else if (this.advanceStack(stack, newStacks, stacks)) {
          continue;
        } else {
          if (!stopped) {
            stopped = [];
            stoppedTokens = [];
          }
          stopped.push(stack);
          let tok = this.tokens.getMainToken(stack);
          stoppedTokens.push(tok.value, tok.end);
        }
        break;
      }
    }
    if (!newStacks.length) {
      let finished = stopped && findFinished(stopped);
      if (finished) {
        if (verbose)
          console.log("Finish with " + this.stackID(finished));
        return this.stackToTree(finished);
      }
      if (this.parser.strict) {
        if (verbose && stopped)
          console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none"));
        throw new SyntaxError("No parse at " + pos);
      }
      if (!this.recovering)
        this.recovering = 5;
    }
    if (this.recovering && stopped) {
      let finished = this.stoppedAt != null && stopped[0].pos > this.stoppedAt ? stopped[0] : this.runRecovery(stopped, stoppedTokens, newStacks);
      if (finished) {
        if (verbose)
          console.log("Force-finish " + this.stackID(finished));
        return this.stackToTree(finished.forceAll());
      }
    }
    if (this.recovering) {
      let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3;
      if (newStacks.length > maxRemaining) {
        newStacks.sort((a, b) => b.score - a.score);
        while (newStacks.length > maxRemaining)
          newStacks.pop();
      }
      if (newStacks.some((s) => s.reducePos > pos))
        this.recovering--;
    } else if (newStacks.length > 1) {
      outer:
        for (let i = 0; i < newStacks.length - 1; i++) {
          let stack = newStacks[i];
          for (let j = i + 1; j < newStacks.length; j++) {
            let other = newStacks[j];
            if (stack.sameState(other) || stack.buffer.length > 500 && other.buffer.length > 500) {
              if ((stack.score - other.score || stack.buffer.length - other.buffer.length) > 0) {
                newStacks.splice(j--, 1);
              } else {
                newStacks.splice(i--, 1);
                continue outer;
              }
            }
          }
        }
      if (newStacks.length > 12)
        newStacks.splice(
          12,
          newStacks.length - 12
          /* Rec.MaxStackCount */
        );
    }
    this.minStackPos = newStacks[0].pos;
    for (let i = 1; i < newStacks.length; i++)
      if (newStacks[i].pos < this.minStackPos)
        this.minStackPos = newStacks[i].pos;
    return null;
  }
  stopAt(pos) {
    if (this.stoppedAt != null && this.stoppedAt < pos)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = pos;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(stack, stacks, split) {
    let start = stack.pos, { parser: parser2 } = this;
    let base = verbose ? this.stackID(stack) + " -> " : "";
    if (this.stoppedAt != null && start > this.stoppedAt)
      return stack.forceReduce() ? stack : null;
    if (this.fragments) {
      let strictCx = stack.curContext && stack.curContext.tracker.strict, cxHash = strictCx ? stack.curContext.hash : 0;
      for (let cached = this.fragments.nodeAt(start); cached; ) {
        let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser2.getGoto(stack.state, cached.type.id) : -1;
        if (match > -1 && cached.length && (!strictCx || (cached.prop(NodeProp.contextHash) || 0) == cxHash)) {
          stack.useNode(cached, match);
          if (verbose)
            console.log(base + this.stackID(stack) + ` (via reuse of ${parser2.getName(cached.type.id)})`);
          return true;
        }
        if (!(cached instanceof Tree) || cached.children.length == 0 || cached.positions[0] > 0)
          break;
        let inner = cached.children[0];
        if (inner instanceof Tree && cached.positions[0] == 0)
          cached = inner;
        else
          break;
      }
    }
    let defaultReduce = parser2.stateSlot(
      stack.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (defaultReduce > 0) {
      stack.reduce(defaultReduce);
      if (verbose)
        console.log(base + this.stackID(stack) + ` (via always-reduce ${parser2.getName(
          defaultReduce & 65535
          /* Action.ValueMask */
        )})`);
      return true;
    }
    if (stack.stack.length >= 8400) {
      while (stack.stack.length > 6e3 && stack.forceReduce()) {
      }
    }
    let actions = this.tokens.getActions(stack);
    for (let i = 0; i < actions.length; ) {
      let action = actions[i++], term = actions[i++], end = actions[i++];
      let last = i == actions.length || !split;
      let localStack = last ? stack : stack.split();
      let main = this.tokens.mainToken;
      localStack.apply(action, term, main ? main.start : localStack.pos, end);
      if (verbose)
        console.log(base + this.stackID(localStack) + ` (via ${(action & 65536) == 0 ? "shift" : `reduce of ${parser2.getName(
          action & 65535
          /* Action.ValueMask */
        )}`} for ${parser2.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
      if (last)
        return true;
      else if (localStack.pos > start)
        stacks.push(localStack);
      else
        split.push(localStack);
    }
    return false;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(stack, newStacks) {
    let pos = stack.pos;
    for (; ; ) {
      if (!this.advanceStack(stack, null, null))
        return false;
      if (stack.pos > pos) {
        pushStackDedup(stack, newStacks);
        return true;
      }
    }
  }
  runRecovery(stacks, tokens, newStacks) {
    let finished = null, restarted = false;
    for (let i = 0; i < stacks.length; i++) {
      let stack = stacks[i], token = tokens[i << 1], tokenEnd = tokens[(i << 1) + 1];
      let base = verbose ? this.stackID(stack) + " -> " : "";
      if (stack.deadEnd) {
        if (restarted)
          continue;
        restarted = true;
        stack.restart();
        if (verbose)
          console.log(base + this.stackID(stack) + " (restarted)");
        let done = this.advanceFully(stack, newStacks);
        if (done)
          continue;
      }
      let force = stack.split(), forceBase = base;
      for (let j = 0; force.forceReduce() && j < 10; j++) {
        if (verbose)
          console.log(forceBase + this.stackID(force) + " (via force-reduce)");
        let done = this.advanceFully(force, newStacks);
        if (done)
          break;
        if (verbose)
          forceBase = this.stackID(force) + " -> ";
      }
      for (let insert of stack.recoverByInsert(token)) {
        if (verbose)
          console.log(base + this.stackID(insert) + " (via recover-insert)");
        this.advanceFully(insert, newStacks);
      }
      if (this.stream.end > stack.pos) {
        if (tokenEnd == stack.pos) {
          tokenEnd++;
          token = 0;
        }
        stack.recoverByDelete(token, tokenEnd);
        if (verbose)
          console.log(base + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
        pushStackDedup(stack, newStacks);
      } else if (!finished || finished.score < stack.score) {
        finished = stack;
      }
    }
    return finished;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(stack) {
    stack.close();
    return Tree.build({
      buffer: StackBufferCursor.create(stack),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: stack.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(stack) {
    let id2 = (stackIDs || (stackIDs = /* @__PURE__ */ new WeakMap())).get(stack);
    if (!id2)
      stackIDs.set(stack, id2 = String.fromCodePoint(this.nextStackID++));
    return id2 + stack;
  }
};
function pushStackDedup(stack, newStacks) {
  for (let i = 0; i < newStacks.length; i++) {
    let other = newStacks[i];
    if (other.pos == stack.pos && other.sameState(stack)) {
      if (newStacks[i].score < stack.score)
        newStacks[i] = stack;
      return;
    }
  }
  newStacks.push(stack);
}
var Dialect = class {
  constructor(source, flags, disabled) {
    this.source = source;
    this.flags = flags;
    this.disabled = disabled;
  }
  allows(term) {
    return !this.disabled || this.disabled[term] == 0;
  }
};
var id = (x) => x;
var ContextTracker = class {
  /**
  Define a context tracker.
  */
  constructor(spec) {
    this.start = spec.start;
    this.shift = spec.shift || id;
    this.reduce = spec.reduce || id;
    this.reuse = spec.reuse || id;
    this.hash = spec.hash || (() => 0);
    this.strict = spec.strict !== false;
  }
};
var LRParser = class _LRParser extends Parser {
  /**
  @internal
  */
  constructor(spec) {
    super();
    this.wrappers = [];
    if (spec.version != 14)
      throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${14})`);
    let nodeNames = spec.nodeNames.split(" ");
    this.minRepeatTerm = nodeNames.length;
    for (let i = 0; i < spec.repeatNodeCount; i++)
      nodeNames.push("");
    let topTerms = Object.keys(spec.topRules).map((r) => spec.topRules[r][1]);
    let nodeProps = [];
    for (let i = 0; i < nodeNames.length; i++)
      nodeProps.push([]);
    function setProp(nodeID, prop, value) {
      nodeProps[nodeID].push([prop, prop.deserialize(String(value))]);
    }
    if (spec.nodeProps)
      for (let propSpec of spec.nodeProps) {
        let prop = propSpec[0];
        if (typeof prop == "string")
          prop = NodeProp[prop];
        for (let i = 1; i < propSpec.length; ) {
          let next = propSpec[i++];
          if (next >= 0) {
            setProp(next, prop, propSpec[i++]);
          } else {
            let value = propSpec[i + -next];
            for (let j = -next; j > 0; j--)
              setProp(propSpec[i++], prop, value);
            i++;
          }
        }
      }
    this.nodeSet = new NodeSet(nodeNames.map((name, i) => NodeType.define({
      name: i >= this.minRepeatTerm ? void 0 : name,
      id: i,
      props: nodeProps[i],
      top: topTerms.indexOf(i) > -1,
      error: i == 0,
      skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i) > -1
    })));
    if (spec.propSources)
      this.nodeSet = this.nodeSet.extend(...spec.propSources);
    this.strict = false;
    this.bufferLength = DefaultBufferLength;
    let tokenArray = decodeArray(spec.tokenData);
    this.context = spec.context;
    this.specializerSpecs = spec.specialized || [];
    this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let i = 0; i < this.specializerSpecs.length; i++)
      this.specialized[i] = this.specializerSpecs[i].term;
    this.specializers = this.specializerSpecs.map(getSpecializer);
    this.states = decodeArray(spec.states, Uint32Array);
    this.data = decodeArray(spec.stateData);
    this.goto = decodeArray(spec.goto);
    this.maxTerm = spec.maxTerm;
    this.tokenizers = spec.tokenizers.map((value) => typeof value == "number" ? new TokenGroup(tokenArray, value) : value);
    this.topRules = spec.topRules;
    this.dialects = spec.dialects || {};
    this.dynamicPrecedences = spec.dynamicPrecedences || null;
    this.tokenPrecTable = spec.tokenPrec;
    this.termNames = spec.termNames || null;
    this.maxNode = this.nodeSet.types.length - 1;
    this.dialect = this.parseDialect();
    this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(input, fragments, ranges) {
    let parse = new Parse(this, input, fragments, ranges);
    for (let w of this.wrappers)
      parse = w(parse, input, fragments, ranges);
    return parse;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(state, term, loose = false) {
    let table = this.goto;
    if (term >= table[0])
      return -1;
    for (let pos = table[term + 1]; ; ) {
      let groupTag = table[pos++], last = groupTag & 1;
      let target = table[pos++];
      if (last && loose)
        return target;
      for (let end = pos + (groupTag >> 1); pos < end; pos++)
        if (table[pos] == state)
          return target;
      if (last)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(state, terminal) {
    let data = this.data;
    for (let set = 0; set < 2; set++) {
      for (let i = this.stateSlot(
        state,
        set ? 2 : 1
        /* ParseState.Actions */
      ), next; ; i += 3) {
        if ((next = data[i]) == 65535) {
          if (data[i + 1] == 1)
            next = data[i = pair(data, i + 2)];
          else if (data[i + 1] == 2)
            return pair(data, i + 2);
          else
            break;
        }
        if (next == terminal || next == 0)
          return pair(data, i + 1);
      }
    }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(state, slot) {
    return this.states[state * 6 + slot];
  }
  /**
  @internal
  */
  stateFlag(state, flag) {
    return (this.stateSlot(
      state,
      0
      /* ParseState.Flags */
    ) & flag) > 0;
  }
  /**
  @internal
  */
  validAction(state, action) {
    return !!this.allActions(state, (a) => a == action ? true : null);
  }
  /**
  @internal
  */
  allActions(state, action) {
    let deflt = this.stateSlot(
      state,
      4
      /* ParseState.DefaultReduce */
    );
    let result = deflt ? action(deflt) : void 0;
    for (let i = this.stateSlot(
      state,
      1
      /* ParseState.Actions */
    ); result == null; i += 3) {
      if (this.data[i] == 65535) {
        if (this.data[i + 1] == 1)
          i = pair(this.data, i + 2);
        else
          break;
      }
      result = action(pair(this.data, i + 1));
    }
    return result;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(state) {
    let result = [];
    for (let i = this.stateSlot(
      state,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535) {
        if (this.data[i + 1] == 1)
          i = pair(this.data, i + 2);
        else
          break;
      }
      if ((this.data[i + 2] & 65536 >> 16) == 0) {
        let value = this.data[i + 1];
        if (!result.some((v, i2) => i2 & 1 && v == value))
          result.push(this.data[i], value);
      }
    }
    return result;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(config) {
    let copy = Object.assign(Object.create(_LRParser.prototype), this);
    if (config.props)
      copy.nodeSet = this.nodeSet.extend(...config.props);
    if (config.top) {
      let info = this.topRules[config.top];
      if (!info)
        throw new RangeError(`Invalid top rule name ${config.top}`);
      copy.top = info;
    }
    if (config.tokenizers)
      copy.tokenizers = this.tokenizers.map((t) => {
        let found = config.tokenizers.find((r) => r.from == t);
        return found ? found.to : t;
      });
    if (config.specializers) {
      copy.specializers = this.specializers.slice();
      copy.specializerSpecs = this.specializerSpecs.map((s, i) => {
        let found = config.specializers.find((r) => r.from == s.external);
        if (!found)
          return s;
        let spec = Object.assign(Object.assign({}, s), { external: found.to });
        copy.specializers[i] = getSpecializer(spec);
        return spec;
      });
    }
    if (config.contextTracker)
      copy.context = config.contextTracker;
    if (config.dialect)
      copy.dialect = this.parseDialect(config.dialect);
    if (config.strict != null)
      copy.strict = config.strict;
    if (config.wrap)
      copy.wrappers = copy.wrappers.concat(config.wrap);
    if (config.bufferLength != null)
      copy.bufferLength = config.bufferLength;
    return copy;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(term) {
    return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(term) {
    let prec = this.dynamicPrecedences;
    return prec == null ? 0 : prec[term] || 0;
  }
  /**
  @internal
  */
  parseDialect(dialect) {
    let values = Object.keys(this.dialects), flags = values.map(() => false);
    if (dialect)
      for (let part of dialect.split(" ")) {
        let id2 = values.indexOf(part);
        if (id2 >= 0)
          flags[id2] = true;
      }
    let disabled = null;
    for (let i = 0; i < values.length; i++)
      if (!flags[i]) {
        for (let j = this.dialects[values[i]], id2; (id2 = this.data[j++]) != 65535; )
          (disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id2] = 1;
      }
    return new Dialect(dialect, flags, disabled);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(spec) {
    return new _LRParser(spec);
  }
};
function pair(data, off) {
  return data[off] | data[off + 1] << 16;
}
function findFinished(stacks) {
  let best = null;
  for (let stack of stacks) {
    let stopped = stack.p.stoppedAt;
    if ((stack.pos == stack.p.stream.end || stopped != null && stack.pos > stopped) && stack.p.parser.stateFlag(
      stack.state,
      2
      /* StateFlag.Accepting */
    ) && (!best || best.score < stack.score))
      best = stack;
  }
  return best;
}
function getSpecializer(spec) {
  if (spec.external) {
    let mask = spec.extend ? 1 : 0;
    return (value, stack) => spec.external(value, stack) << 1 | mask;
  }
  return spec.get;
}

// node_modules/@lezer/javascript/dist/index.js
var noSemi = 309;
var incdec = 1;
var incdecPrefix = 2;
var JSXStartTag = 3;
var insertSemi = 310;
var spaces = 312;
var newline = 313;
var LineComment = 4;
var BlockComment = 5;
var Dialect_jsx = 0;
var space = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
];
var braceR = 125;
var semicolon = 59;
var slash = 47;
var star = 42;
var plus = 43;
var minus = 45;
var lt = 60;
var comma = 44;
var trackNewline = new ContextTracker({
  start: false,
  shift(context, term) {
    return term == LineComment || term == BlockComment || term == spaces ? context : term == newline;
  },
  strict: false
});
var insertSemicolon = new ExternalTokenizer((input, stack) => {
  let { next } = input;
  if (next == braceR || next == -1 || stack.context)
    input.acceptToken(insertSemi);
}, { contextual: true, fallback: true });
var noSemicolon = new ExternalTokenizer((input, stack) => {
  let { next } = input, after;
  if (space.indexOf(next) > -1)
    return;
  if (next == slash && ((after = input.peek(1)) == slash || after == star))
    return;
  if (next != braceR && next != semicolon && next != -1 && !stack.context)
    input.acceptToken(noSemi);
}, { contextual: true });
var incdecToken = new ExternalTokenizer((input, stack) => {
  let { next } = input;
  if (next == plus || next == minus) {
    input.advance();
    if (next == input.next) {
      input.advance();
      let mayPostfix = !stack.context && stack.canShift(incdec);
      input.acceptToken(mayPostfix ? incdec : incdecPrefix);
    }
  }
}, { contextual: true });
function identifierChar(ch, start) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch == 95 || ch >= 192 || !start && ch >= 48 && ch <= 57;
}
var jsx = new ExternalTokenizer((input, stack) => {
  if (input.next != lt || !stack.dialectEnabled(Dialect_jsx))
    return;
  input.advance();
  if (input.next == slash)
    return;
  let back = 0;
  while (space.indexOf(input.next) > -1) {
    input.advance();
    back++;
  }
  if (identifierChar(input.next, true)) {
    input.advance();
    back++;
    while (identifierChar(input.next, false)) {
      input.advance();
      back++;
    }
    while (space.indexOf(input.next) > -1) {
      input.advance();
      back++;
    }
    if (input.next == comma)
      return;
    for (let i = 0; ; i++) {
      if (i == 7) {
        if (!identifierChar(input.next, true))
          return;
        break;
      }
      if (input.next != "extends".charCodeAt(i))
        break;
      input.advance();
      back++;
    }
  }
  input.acceptToken(JSXStartTag, -back);
});
var jsHighlight = styleTags({
  "get set async static": tags.modifier,
  "for while do if else switch try catch finally return throw break continue default case": tags.controlKeyword,
  "in of await yield void typeof delete instanceof": tags.operatorKeyword,
  "let var const using function class extends": tags.definitionKeyword,
  "import export from": tags.moduleKeyword,
  "with debugger as new": tags.keyword,
  TemplateString: tags.special(tags.string),
  super: tags.atom,
  BooleanLiteral: tags.bool,
  this: tags.self,
  null: tags.null,
  Star: tags.modifier,
  VariableName: tags.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": tags.function(tags.variableName),
  VariableDefinition: tags.definition(tags.variableName),
  Label: tags.labelName,
  PropertyName: tags.propertyName,
  PrivatePropertyName: tags.special(tags.propertyName),
  "CallExpression/MemberExpression/PropertyName": tags.function(tags.propertyName),
  "FunctionDeclaration/VariableDefinition": tags.function(tags.definition(tags.variableName)),
  "ClassDeclaration/VariableDefinition": tags.definition(tags.className),
  PropertyDefinition: tags.definition(tags.propertyName),
  PrivatePropertyDefinition: tags.definition(tags.special(tags.propertyName)),
  UpdateOp: tags.updateOperator,
  "LineComment Hashbang": tags.lineComment,
  BlockComment: tags.blockComment,
  Number: tags.number,
  String: tags.string,
  Escape: tags.escape,
  ArithOp: tags.arithmeticOperator,
  LogicOp: tags.logicOperator,
  BitOp: tags.bitwiseOperator,
  CompareOp: tags.compareOperator,
  RegExp: tags.regexp,
  Equals: tags.definitionOperator,
  Arrow: tags.function(tags.punctuation),
  ": Spread": tags.punctuation,
  "( )": tags.paren,
  "[ ]": tags.squareBracket,
  "{ }": tags.brace,
  "InterpolationStart InterpolationEnd": tags.special(tags.brace),
  ".": tags.derefOperator,
  ", ;": tags.separator,
  "@": tags.meta,
  TypeName: tags.typeName,
  TypeDefinition: tags.definition(tags.typeName),
  "type enum interface implements namespace module declare": tags.definitionKeyword,
  "abstract global Privacy readonly override": tags.modifier,
  "is keyof unique infer": tags.operatorKeyword,
  JSXAttributeValue: tags.attributeValue,
  JSXText: tags.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": tags.angleBracket,
  "JSXIdentifier JSXNameSpacedName": tags.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": tags.attributeName,
  "JSXBuiltin/JSXIdentifier": tags.standard(tags.tagName)
});
var spec_identifier = { __proto__: null, export: 18, as: 23, from: 31, default: 34, async: 39, function: 40, extends: 52, this: 56, true: 64, false: 64, null: 76, void: 80, typeof: 84, super: 102, new: 136, delete: 152, yield: 161, await: 165, class: 170, public: 227, private: 227, protected: 227, readonly: 229, instanceof: 248, satisfies: 251, in: 252, const: 254, import: 286, keyof: 339, unique: 343, infer: 349, is: 385, abstract: 405, implements: 407, type: 409, let: 412, var: 414, using: 417, interface: 423, enum: 427, namespace: 433, module: 435, declare: 439, global: 443, for: 462, of: 471, while: 474, with: 478, do: 482, if: 486, else: 488, switch: 492, case: 498, try: 504, catch: 508, finally: 512, return: 516, throw: 520, break: 524, continue: 528, debugger: 532 };
var spec_word = { __proto__: null, async: 123, get: 125, set: 127, declare: 187, public: 189, private: 189, protected: 189, static: 191, abstract: 193, override: 195, readonly: 201, accessor: 203, new: 389 };
var spec_LessThan = { __proto__: null, "<": 143 };
var parser = LRParser.deserialize({
  version: 14,
  states: "$<UO%TQ^OOO%[Q^OOO'_Q`OOP(lOWOOO*zQ08SO'#ChO+RO!bO'#CiO+aO#tO'#CiO+oO?MpO'#D^O.QQ^O'#DdO.bQ^O'#DoO%[Q^O'#DyO0fQ^O'#EROOQ07b'#EZ'#EZO1PQWO'#EWOOQO'#El'#ElOOQO'#Ie'#IeO1XQWO'#GmO1dQWO'#EkO1iQWO'#EkO3kQ08SO'#JiO6[Q08SO'#JjO6xQWO'#FZO6}Q&jO'#FqOOQ07b'#Fc'#FcO7YO,YO'#FcO7hQ7[O'#FxO9UQWO'#FwOOQ07b'#Jj'#JjOOQ07`'#Ji'#JiO9ZQWO'#GqOOQU'#KU'#KUO9fQWO'#IRO9kQ07hO'#ISOOQU'#JW'#JWOOQU'#IW'#IWQ`Q^OOO`Q^OOO%[Q^O'#DqO9sQ^O'#D}O9zQ^O'#EPO9aQWO'#GmO:RQ7[O'#CnO:aQWO'#EjO:lQWO'#EuO:qQ7[O'#FbO;`QWO'#GmOOQO'#KV'#KVO;eQWO'#KVO;sQWO'#GuO;sQWO'#GvO;sQWO'#GxO9aQWO'#G{O<jQWO'#HOO>RQWO'#CdO>cQWO'#H[O>kQWO'#HbO>kQWO'#HdO`Q^O'#HfO>kQWO'#HhO>kQWO'#HkO>pQWO'#HqO>uQ07iO'#HwO%[Q^O'#HyO?QQ07iO'#H{O?]Q07iO'#H}O9kQ07hO'#IPO?hQ08SO'#ChO@jQ`O'#DiQOQWOOO%[Q^O'#EPOAQQWO'#ESO:RQ7[O'#EjOA]QWO'#EjOAhQpO'#FbOOQU'#Cf'#CfOOQ07`'#Dn'#DnOOQ07`'#Jm'#JmO%[Q^O'#JmOOQO'#Jq'#JqOOQO'#Ib'#IbOBhQ`O'#EcOOQ07`'#Eb'#EbOCdQ07pO'#EcOCnQ`O'#EVOOQO'#Jp'#JpODSQ`O'#JqOEaQ`O'#EVOCnQ`O'#EcPEnO!0LbO'#CaPOOO)CDu)CDuOOOO'#IX'#IXOEyO!bO,59TOOQ07b,59T,59TOOOO'#IY'#IYOFXO#tO,59TO%[Q^O'#D`OOOO'#I['#I[OFgO?MpO,59xOOQ07b,59x,59xOFuQ^O'#I]OGYQWO'#JkOI[QrO'#JkO+}Q^O'#JkOIcQWO,5:OOIyQWO'#ElOJWQWO'#JyOJcQWO'#JxOJcQWO'#JxOJkQWO,5;YOJpQWO'#JwOOQ07f,5:Z,5:ZOJwQ^O,5:ZOLxQ08SO,5:eOMiQWO,5:mONSQ07hO'#JvONZQWO'#JuO9ZQWO'#JuONoQWO'#JuONwQWO,5;XON|QWO'#JuO!#UQrO'#JjOOQ07b'#Ch'#ChO%[Q^O'#ERO!#tQpO,5:rOOQO'#Jr'#JrOOQO-E<c-E<cO9aQWO,5=XO!$[QWO,5=XO!$aQ^O,5;VO!&dQ7[O'#EgO!'}QWO,5;VO!)mQ7[O'#DsO!)tQ^O'#DxO!*OQ`O,5;`O!*WQ`O,5;`O%[Q^O,5;`OOQU'#FR'#FROOQU'#FT'#FTO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aOOQU'#FX'#FXO!*fQ^O,5;rOOQ07b,5;w,5;wOOQ07b,5;x,5;xO!,iQWO,5;xOOQ07b,5;y,5;yO%[Q^O'#IiO!,qQ07hO,5<eO!&dQ7[O,5;aO!-`Q7[O,5;aO%[Q^O,5;uO!-gQ&jO'#FgO!.dQ&jO'#J}O!.OQ&jO'#J}O!.kQ&jO'#J}OOQO'#J}'#J}O!/PQ&jO,5<POOOS,5<],5<]O!/bQ^O'#FsOOOS'#Ih'#IhO7YO,YO,5;}O!/iQ&jO'#FuOOQ07b,5;},5;}O!0YQMhO'#CuOOQ07b'#Cy'#CyO!0mQWO'#CyO!0rO?MpO'#C}O!1`Q7[O,5<bO!1gQWO,5<dO!3SQ!LQO'#GSO!3aQWO'#GTO!3fQWO'#GTO!3kQ!LQO'#GXO!4jQ`O'#G]OOQO'#Gh'#GhO!(SQ7[O'#GgOOQO'#Gj'#GjO!(SQ7[O'#GiO!5]QMhO'#JdOOQ07b'#Jd'#JdO!5gQWO'#JcO!5uQWO'#JbO!5}QWO'#CtOOQ07b'#Cw'#CwOOQ07b'#DR'#DROOQ07b'#DT'#DTO1SQWO'#DVO!(SQ7[O'#FzO!(SQ7[O'#F|O!6VQWO'#GOO!6[QWO'#GPO!3fQWO'#GVO!(SQ7[O'#G[O!6aQWO'#EmO!7OQWO,5<cOOQ07`'#Cq'#CqO!7WQWO'#EnO!8QQ`O'#EoOOQ07`'#Jw'#JwO!8XQ07hO'#KWO9kQ07hO,5=]O`Q^O,5>mOOQU'#J`'#J`OOQU,5>n,5>nOOQU-E<U-E<UO!:ZQ08SO,5:]O!<wQ08SO,5:iO%[Q^O,5:iO!?bQ08SO,5:kOOQO,5@q,5@qO!@RQ7[O,5=XO!@aQ07hO'#JaO9UQWO'#JaO!@rQ07hO,59YO!@}Q`O,59YO!AVQ7[O,59YO:RQ7[O,59YO!AbQWO,5;VO!AjQWO'#HZO!BOQWO'#KZO%[Q^O,5;zO!7{Q`O,5;|O!BWQWO,5=tO!B]QWO,5=tO!BbQWO,5=tO9kQ07hO,5=tO;sQWO,5=dOOQO'#Cu'#CuO!BpQ`O,5=aO!BxQ7[O,5=bO!CTQWO,5=dO!CYQpO,5=gO!CbQWO'#KVO>pQWO'#HQO9aQWO'#HSO!CgQWO'#HSO:RQ7[O'#HUO!ClQWO'#HUOOQU,5=j,5=jO!CqQWO'#HVO!DSQWO'#CnO!DXQWO,59OO!DcQWO,59OO!FhQ^O,59OOOQU,59O,59OO!FxQ07hO,59OO%[Q^O,59OO!ITQ^O'#H^OOQU'#H_'#H_OOQU'#H`'#H`O`Q^O,5=vO!IkQWO,5=vO`Q^O,5=|O`Q^O,5>OO!IpQWO,5>QO`Q^O,5>SO!IuQWO,5>VO!IzQ^O,5>]OOQU,5>c,5>cO%[Q^O,5>cO9kQ07hO,5>eOOQU,5>g,5>gO!NUQWO,5>gOOQU,5>i,5>iO!NUQWO,5>iOOQU,5>k,5>kO!NZQ`O'#D[O%[Q^O'#JmO!NxQ`O'#JmO# gQ`O'#DjO# xQ`O'#DjO#$ZQ^O'#DjO#$bQWO'#JlO#$jQWO,5:TO#$oQWO'#EpO#$}QWO'#JzO#%VQWO,5;ZO#%[Q`O'#DjO#%iQ`O'#EUOOQ07b,5:n,5:nO%[Q^O,5:nO#%pQWO,5:nO>pQWO,5;UO!@}Q`O,5;UO!AVQ7[O,5;UO:RQ7[O,5;UO#%xQWO,5@XO#%}Q$ISO,5:rOOQO-E<`-E<`O#'TQ07pO,5:}OCnQ`O,5:qO#'_Q`O,5:qOCnQ`O,5:}O!@rQ07hO,5:qOOQ07`'#Ef'#EfOOQO,5:},5:}O%[Q^O,5:}O#'lQ07hO,5:}O#'wQ07hO,5:}O!@}Q`O,5:qOOQO,5;T,5;TO#(VQ07hO,5:}POOO'#IV'#IVP#(kO!0LbO,58{POOO,58{,58{OOOO-E<V-E<VOOQ07b1G.o1G.oOOOO-E<W-E<WO#(vQpO,59zOOOO-E<Y-E<YOOQ07b1G/d1G/dO#({QrO,5>wO+}Q^O,5>wOOQO,5>},5>}O#)VQ^O'#I]OOQO-E<Z-E<ZO#)dQWO,5@VO#)lQrO,5@VO#)sQWO,5@dOOQ07b1G/j1G/jO%[Q^O,5@eO#){QWO'#IcOOQO-E<a-E<aO#)sQWO,5@dOOQ07`1G0t1G0tOOQ07f1G/u1G/uOOQ07f1G0X1G0XO%[Q^O,5@bO#*aQ07hO,5@bO#*rQ07hO,5@bO#*yQWO,5@aO9ZQWO,5@aO#+RQWO,5@aO#+aQWO'#IfO#*yQWO,5@aOOQ07`1G0s1G0sO!*OQ`O,5:tO!*ZQ`O,5:tOOQO,5:v,5:vO#,RQWO,5:vO#,ZQ7[O1G2sO9aQWO1G2sOOQ07b1G0q1G0qO#,iQ08SO1G0qO#-nQ08QO,5;ROOQ07b'#GR'#GRO#.[Q08SO'#JdO!$aQ^O1G0qO#0dQ7[O'#JnO#0nQWO,5:_O#0sQrO'#JoO%[Q^O'#JoO#0}QWO,5:dOOQ07b'#D['#D[OOQ07b1G0z1G0zO%[Q^O1G0zOOQ07b1G1d1G1dO#1SQWO1G0zO#3kQ08SO1G0{O#3rQ08SO1G0{O#6]Q08SO1G0{O#6dQ08SO1G0{O#8nQ08SO1G0{O#9UQ08SO1G0{O#<OQ08SO1G0{O#<VQ08SO1G0{O#>jQ08SO1G0{O#>wQ08SO1G0{O#@uQ08SO1G0{O#CuQ(CYO'#ChO#EsQ(CYO1G1^O#EzQ(CYO'#JjO!,lQWO1G1dO#F[Q08SO,5?TOOQ07`-E<g-E<gO#GOQ08SO1G0{OOQ07b1G0{1G0{O#IZQ08SO1G1aO#I}Q&jO,5<TO#JVQ&jO,5<UO#J_Q&jO'#FlO#JvQWO'#FkOOQO'#KO'#KOOOQO'#Ig'#IgO#J{Q&jO1G1kOOQ07b1G1k1G1kOOOS1G1v1G1vO#K^Q(CYO'#JiO#KhQWO,5<_O!*fQ^O,5<_OOOS-E<f-E<fOOQ07b1G1i1G1iO#KmQ`O'#J}OOQ07b,5<a,5<aO#KuQ`O,5<aOOQ07b,59e,59eO!&dQ7[O'#DPOOOO'#IZ'#IZO#KzO?MpO,59iOOQ07b,59i,59iO%[Q^O1G1|O!6[QWO'#IkO#LVQ7[O,5<uOOQ07b,5<r,5<rO!(SQ7[O'#InO#LuQ7[O,5=RO!(SQ7[O'#IpO#MhQ7[O,5=TO!&dQ7[O,5=VOOQO1G2O1G2OO#MrQpO'#CqO#NVQpO,5<nO#N^QWO'#KRO9aQWO'#KRO#NlQWO,5<pO!(SQ7[O,5<oO#NqQWO'#GUO#N|QWO,5<oO$ RQpO'#GRO$ `QpO'#KSO$ jQWO'#KSO!&dQ7[O'#KSO$ oQWO,5<sO$ tQ`O'#G^O!4eQ`O'#G^O$!VQWO'#G`O$![QWO'#GbO!3fQWO'#GeO$!aQ07hO'#ImO$!lQ`O,5<wOOQ07f,5<w,5<wO$!sQ`O'#G^O$#RQ`O'#G_O$#ZQ`O'#G_O$#`Q7[O,5=RO$#pQ7[O,5=TOOQ07b,5=W,5=WO!(SQ7[O,5?}O!(SQ7[O,5?}O$$QQWO'#IrO$$]QWO,5?|O$$eQWO,59`O$%UQ7[O,59qOOQ07b,59q,59qO$%wQ7[O,5<fO$&jQ7[O,5<hO@bQWO,5<jOOQ07b,5<k,5<kO$&tQWO,5<qO$&yQ7[O,5<vO$'ZQWO'#JuO!$aQ^O1G1}O$'`QWO1G1}O9ZQWO'#JxO9ZQWO'#EpO%[Q^O'#EpO9ZQWO'#ItO$'eQ07hO,5@rOOQU1G2w1G2wOOQU1G4X1G4XOOQ07b1G/w1G/wO!,iQWO1G/wO$)jQ08SO1G0TOOQU1G2s1G2sO!&dQ7[O1G2sO%[Q^O1G2sO#,^QWO1G2sO$+nQ7[O'#EgOOQ07`,5?{,5?{O$+xQ07hO,5?{OOQU1G.t1G.tO!@rQ07hO1G.tO!@}Q`O1G.tO!AVQ7[O1G.tO$,ZQWO1G0qO$,`QWO'#ChO$,kQWO'#K[O$,sQWO,5=uO$,xQWO'#K[O$,}QWO'#K[O$-]QWO'#IzO$-kQWO,5@uO$-sQrO1G1fOOQ07b1G1h1G1hO9aQWO1G3`O@bQWO1G3`O$-zQWO1G3`O$.PQWO1G3`OOQU1G3`1G3`O!CTQWO1G3OO!&dQ7[O1G2{O$.UQWO1G2{OOQU1G2|1G2|O!&dQ7[O1G2|O$.ZQWO1G2|O$.cQ`O'#GzOOQU1G3O1G3OO!4eQ`O'#IvO!CYQpO1G3ROOQU1G3R1G3ROOQU,5=l,5=lO$.kQ7[O,5=nO9aQWO,5=nO$![QWO,5=pO9UQWO,5=pO!@}Q`O,5=pO!AVQ7[O,5=pO:RQ7[O,5=pO$.yQWO'#KYO$/UQWO,5=qOOQU1G.j1G.jO$/ZQ07hO1G.jO@bQWO1G.jO$/fQWO1G.jO9kQ07hO1G.jO$1kQrO,5@wO$1{QWO,5@wO9ZQWO,5@wO$2WQ^O,5=xO$2_QWO,5=xOOQU1G3b1G3bO`Q^O1G3bOOQU1G3h1G3hOOQU1G3j1G3jO>kQWO1G3lO$2dQ^O1G3nO$6hQ^O'#HmOOQU1G3q1G3qO$6uQWO'#HsO>pQWO'#HuOOQU1G3w1G3wO$6}Q^O1G3wO9kQ07hO1G3}OOQU1G4P1G4POOQ07`'#GY'#GYO9kQ07hO1G4RO9kQ07hO1G4TO$;UQWO,5@XO!*fQ^O,5;[O9ZQWO,5;[O>pQWO,5:UO!*fQ^O,5:UO!@}Q`O,5:UO$;ZQ(CYO,5:UOOQO,5;[,5;[O$;eQ`O'#I^O$;{QWO,5@WOOQ07b1G/o1G/oO$<TQ`O'#IdO$<_QWO,5@fOOQ07`1G0u1G0uO# xQ`O,5:UOOQO'#Ia'#IaO$<gQ`O,5:pOOQ07f,5:p,5:pO#%sQWO1G0YOOQ07b1G0Y1G0YO%[Q^O1G0YOOQ07b1G0p1G0pO>pQWO1G0pO!@}Q`O1G0pO!AVQ7[O1G0pOOQ07`1G5s1G5sO!@rQ07hO1G0]OOQO1G0i1G0iO%[Q^O1G0iO$<nQ07hO1G0iO$<yQ07hO1G0iO!@}Q`O1G0]OCnQ`O1G0]O$=XQ07hO1G0iOOQO1G0]1G0]O$=mQ08SO1G0iPOOO-E<T-E<TPOOO1G.g1G.gOOOO1G/f1G/fO$=wQpO,5<eO$>PQrO1G4cOOQO1G4i1G4iO%[Q^O,5>wO$>ZQWO1G5qO$>cQWO1G6OO$>kQrO1G6PO9ZQWO,5>}O$>uQ08SO1G5|O%[Q^O1G5|O$?VQ07hO1G5|O$?hQWO1G5{O$?hQWO1G5{O9ZQWO1G5{O$?pQWO,5?QO9ZQWO,5?QOOQO,5?Q,5?QO$@UQWO,5?QO$'ZQWO,5?QOOQO-E<d-E<dOOQO1G0`1G0`OOQO1G0b1G0bO!,lQWO1G0bOOQU7+(_7+(_O!&dQ7[O7+(_O%[Q^O7+(_O$@dQWO7+(_O$@oQ7[O7+(_O$@}Q08SO,5=RO$CYQ08SO,5=TO$EeQ08SO,5=RO$GvQ08SO,5=TO$JXQ08SO,59qO$LaQ08SO,5<fO$NlQ08SO,5<hO%!wQ08SO,5<vOOQ07b7+&]7+&]O%%YQ08SO7+&]O%%|Q7[O'#I_O%&WQWO,5@YOOQ07b1G/y1G/yO%&`Q^O'#I`O%&mQWO,5@ZO%&uQrO,5@ZOOQ07b1G0O1G0OO%'PQWO7+&fOOQ07b7+&f7+&fO%'UQ(CYO,5:eO%[Q^O7+&xO%'`Q(CYO,5:]O%'mQ(CYO,5:iO%'wQ(CYO,5:kOOQ07b7+'O7+'OOOQO1G1o1G1oOOQO1G1p1G1pO%(RQtO,5<WO!*fQ^O,5<VOOQO-E<e-E<eOOQ07b7+'V7+'VOOOS7+'b7+'bOOOS1G1y1G1yO%(^QWO1G1yOOQ07b1G1{1G1{O%(cQpO,59kOOOO-E<X-E<XOOQ07b1G/T1G/TO%(jQ08SO7+'hOOQ07b,5?V,5?VO%)^QpO,5?VOOQ07b1G2a1G2aP!&dQ7[O'#IkPOQ07b-E<i-E<iO%)|Q7[O,5?YOOQ07b-E<l-E<lO%*oQ7[O,5?[OOQ07b-E<n-E<nO%*yQpO1G2qOOQ07b1G2Y1G2YO%+QQWO'#IjO%+`QWO,5@mO%+`QWO,5@mO%+hQWO,5@mO%+sQWO,5@mOOQO1G2[1G2[O%,RQ7[O1G2ZO!(SQ7[O1G2ZO%,cQ!LQO'#IlO%,sQWO,5@nO!&dQ7[O,5@nO%,{QpO,5@nOOQ07b1G2_1G2_OOQ07`,5<x,5<xOOQ07`,5<y,5<yO$'ZQWO,5<yOC_QWO,5<yO!@}Q`O,5<xOOQO'#Ga'#GaO%-VQWO,5<zOOQ07`,5<|,5<|O$'ZQWO,5=POOQO,5?X,5?XOOQO-E<k-E<kOOQ07f1G2c1G2cO!4eQ`O,5<xO%-_QWO,5<yO$!VQWO,5<zO!4eQ`O,5<yO!(SQ7[O'#InO%.RQ7[O1G2mO!(SQ7[O'#IpO%.tQ7[O1G2oO%/OQ7[O1G5iO%/YQ7[O1G5iOOQO,5?^,5?^OOQO-E<p-E<pOOQO1G.z1G.zO!7{Q`O,59sO%[Q^O,59sO%/gQWO1G2UO!(SQ7[O1G2]O%/lQ08SO7+'iOOQ07b7+'i7+'iO!$aQ^O7+'iO%0`QWO,5;[OOQ07`,5?`,5?`OOQ07`-E<r-E<rOOQ07b7+%c7+%cO%0eQpO'#KTO#%sQWO7+(_O%0oQrO7+(_O$@gQWO7+(_O%0vQ08QO'#ChO%1ZQ08QO,5<}O%1{QWO,5<}OOQ07`1G5g1G5gOOQU7+$`7+$`O!@rQ07hO7+$`O!@}Q`O7+$`O!$aQ^O7+&]O%2QQWO'#IyO%2iQWO,5@vOOQO1G3a1G3aO9aQWO,5@vO%2iQWO,5@vO%2qQWO,5@vOOQO,5?f,5?fOOQO-E<x-E<xOOQ07b7+'Q7+'QO%2vQWO7+(zO9kQ07hO7+(zO9aQWO7+(zO@bQWO7+(zOOQU7+(j7+(jO%2{Q08QO7+(gO!&dQ7[O7+(gO%3VQpO7+(hOOQU7+(h7+(hO!&dQ7[O7+(hO%3^QWO'#KXO%3iQWO,5=fOOQO,5?b,5?bOOQO-E<t-E<tOOQU7+(m7+(mO%4xQ`O'#HTOOQU1G3Y1G3YO!&dQ7[O1G3YO%[Q^O1G3YO%5PQWO1G3YO%5[Q7[O1G3YO9kQ07hO1G3[O$![QWO1G3[O9UQWO1G3[O!@}Q`O1G3[O!AVQ7[O1G3[O%5jQWO'#IxO%6OQWO,5@tO%6WQ`O,5@tOOQ07`1G3]1G3]OOQU7+$U7+$UO@bQWO7+$UO9kQ07hO7+$UO%6cQWO7+$UO%[Q^O1G6cO%[Q^O1G6dO%6hQ07hO1G6cO%6rQ^O1G3dO%6yQWO1G3dO%7OQ^O1G3dOOQU7+(|7+(|O9kQ07hO7+)WO`Q^O7+)YOOQU'#K_'#K_OOQU'#I{'#I{O%7VQ^O,5>XOOQU,5>X,5>XO%[Q^O'#HnO%7dQWO'#HpOOQU,5>_,5>_O9ZQWO,5>_OOQU,5>a,5>aOOQU7+)c7+)cOOQU7+)i7+)iOOQU7+)m7+)mOOQU7+)o7+)oO%7iQ`O1G5sO%7}Q(CYO1G0vO%8XQWO1G0vOOQO1G/p1G/pO%8dQ(CYO1G/pO>pQWO1G/pO!*fQ^O'#DjOOQO,5>x,5>xOOQO-E<[-E<[OOQO,5?O,5?OOOQO-E<b-E<bO!@}Q`O1G/pOOQO-E<_-E<_OOQ07f1G0[1G0[OOQ07b7+%t7+%tO#%sQWO7+%tOOQ07b7+&[7+&[O>pQWO7+&[O!@}Q`O7+&[OOQO7+%w7+%wO$=mQ08SO7+&TOOQO7+&T7+&TO%[Q^O7+&TO%8nQ07hO7+&TO!@rQ07hO7+%wO!@}Q`O7+%wO%8yQ07hO7+&TO%9XQ08SO7++hO%[Q^O7++hO%9iQWO7++gO%9iQWO7++gOOQO1G4l1G4lO9ZQWO1G4lO%9qQWO1G4lOOQO7+%|7+%|O#%sQWO<<KyO%0oQrO<<KyO%:PQWO<<KyOOQU<<Ky<<KyO!&dQ7[O<<KyO%[Q^O<<KyO%:XQWO<<KyO%:dQ08SO,5?YO%<oQ08SO,5?[O%>zQ08SO1G2ZO%A]Q08SO1G2mO%ChQ08SO1G2oO%EsQ7[O,5>yOOQO-E<]-E<]O%E}QrO,5>zO%[Q^O,5>zOOQO-E<^-E<^O%FXQWO1G5uOOQ07b<<JQ<<JQO%FaQ(CYO1G0qO%HkQ(CYO1G0{O%HrQ(CYO1G0{O%JvQ(CYO1G0{O%J}Q(CYO1G0{O%LrQ(CYO1G0{O%MYQ(CYO1G0{O& mQ(CYO1G0{O& tQ(CYO1G0{O&#rQ(CYO1G0{O&$PQ(CYO1G0{O&%}Q(CYO1G0{O&&bQ08SO<<JdO&'gQ(CYO1G0{O&)]Q(CYO'#JdO&+`Q(CYO1G1aO&+mQ(CYO1G0TO!*fQ^O'#FnOOQO'#KP'#KPOOQO1G1r1G1rO&+wQWO1G1qO&+|Q(CYO,5?TOOOS7+'e7+'eOOOO1G/V1G/VOOQ07b1G4q1G4qO!(SQ7[O7+(]O&,WQWO,5?UO9aQWO,5?UOOQO-E<h-E<hO&,fQWO1G6XO&,fQWO1G6XO&,nQWO1G6XO&,yQ7[O7+'uO&-ZQpO,5?WO&-eQWO,5?WO!&dQ7[O,5?WOOQO-E<j-E<jO&-jQpO1G6YO&-tQWO1G6YOOQ07`1G2e1G2eO$'ZQWO1G2eOOQ07`1G2d1G2dO&-|QWO1G2fO!&dQ7[O1G2fOOQ07`1G2k1G2kO!@}Q`O1G2dOC_QWO1G2eO&.RQWO1G2fO&.ZQWO1G2eO&.}Q7[O,5?YOOQ07b-E<m-E<mO&/pQ7[O,5?[OOQ07b-E<o-E<oO!(SQ7[O7++TOOQ07b1G/_1G/_O&/zQWO1G/_OOQ07b7+'p7+'pO&0PQ7[O7+'wO&0aQ08SO<<KTOOQ07b<<KT<<KTO&1TQWO1G0vO!&dQ7[O'#IsO&1YQWO,5@oO!&dQ7[O1G2iOOQU<<Gz<<GzO!@rQ07hO<<GzO&1bQ08SO<<IwOOQ07b<<Iw<<IwOOQO,5?e,5?eO&2UQWO,5?eO&2ZQWO,5?eOOQO-E<w-E<wO&2iQWO1G6bO&2iQWO1G6bO9aQWO1G6bO@bQWO<<LfOOQU<<Lf<<LfO&2qQWO<<LfO9kQ07hO<<LfOOQU<<LR<<LRO%2{Q08QO<<LROOQU<<LS<<LSO%3VQpO<<LSO&2vQ`O'#IuO&3RQWO,5@sO!*fQ^O,5@sOOQU1G3Q1G3QO&3ZQ^O'#JmOOQO'#Iw'#IwO9kQ07hO'#IwO&3eQ`O,5=oOOQU,5=o,5=oO&3lQ`O'#EcO&4QQWO7+(tO&4VQWO7+(tOOQU7+(t7+(tO!&dQ7[O7+(tO%[Q^O7+(tO&4_QWO7+(tOOQU7+(v7+(vO9kQ07hO7+(vO$![QWO7+(vO9UQWO7+(vO!@}Q`O7+(vO&4jQWO,5?dOOQO-E<v-E<vOOQO'#HW'#HWO&4uQWO1G6`O9kQ07hO<<GpOOQU<<Gp<<GpO@bQWO<<GpO&4}QWO7++}O&5SQWO7+,OO%[Q^O7++}O%[Q^O7+,OOOQU7+)O7+)OO&5XQWO7+)OO&5^Q^O7+)OO&5eQWO7+)OOOQU<<Lr<<LrOOQU<<Lt<<LtOOQU-E<y-E<yOOQU1G3s1G3sO&5jQWO,5>YOOQU,5>[,5>[O&5oQWO1G3yO9ZQWO7+&bO!*fQ^O7+&bOOQO7+%[7+%[O&5tQ(CYO1G6PO>pQWO7+%[OOQ07b<<I`<<I`OOQ07b<<Iv<<IvO>pQWO<<IvOOQO<<Io<<IoO$=mQ08SO<<IoO%[Q^O<<IoOOQO<<Ic<<IcO!@rQ07hO<<IcO&6OQ07hO<<IoO&6ZQ08SO<= SO&6kQWO<= ROOQO7+*W7+*WO9ZQWO7+*WOOQUANAeANAeO&6sQWOANAeO!&dQ7[OANAeO#%sQWOANAeO%0oQrOANAeO%[Q^OANAeO&6{Q08SO7+'uO&9^Q08SO,5?YO&;iQ08SO,5?[O&=tQ08SO7+'wO&@VQrO1G4fO&@aQ(CYO7+&]O&BeQ(CYO,5=RO&DlQ(CYO,5=TO&D|Q(CYO,5=RO&E^Q(CYO,5=TO&EnQ(CYO,59qO&GqQ(CYO,5<fO&ItQ(CYO,5<hO&KwQ(CYO,5<vO&MmQ(CYO7+'hO&MzQ(CYO7+'iO&NXQWO,5<YOOQO7+']7+']O&N^Q7[O<<KwOOQO1G4p1G4pO&NeQWO1G4pO&NpQWO1G4pO' OQWO7++sO' OQWO7++sO!&dQ7[O1G4rO' WQpO1G4rO' bQWO7++tOOQ07`7+(P7+(PO$'ZQWO7+(QO' jQpO7+(QOOQ07`7+(O7+(OO$'ZQWO7+(PO' qQWO7+(QO!&dQ7[O7+(QOC_QWO7+(PO' vQ7[O<<NoOOQ07b7+$y7+$yO'!QQpO,5?_OOQO-E<q-E<qO'![Q08QO7+(TOOQUAN=fAN=fO9aQWO1G5POOQO1G5P1G5PO'!lQWO1G5PO'!qQWO7++|O'!qQWO7++|O9kQ07hOANBQO@bQWOANBQOOQUANBQANBQOOQUANAmANAmOOQUANAnANAnO'!yQWO,5?aOOQO-E<s-E<sO'#UQ(CYO1G6_O'%fQrO'#ChOOQO,5?c,5?cOOQO-E<u-E<uOOQU1G3Z1G3ZO&3ZQ^O,5<zOOQU<<L`<<L`O!&dQ7[O<<L`O&4QQWO<<L`O'%pQWO<<L`O%[Q^O<<L`OOQU<<Lb<<LbO9kQ07hO<<LbO$![QWO<<LbO9UQWO<<LbO'%xQ`O1G5OO'&TQWO7++zOOQUAN=[AN=[O9kQ07hOAN=[OOQU<= i<= iOOQU<= j<= jO'&]QWO<= iO'&bQWO<= jOOQU<<Lj<<LjO'&gQWO<<LjO'&lQ^O<<LjOOQU1G3t1G3tO>pQWO7+)eO'&sQWO<<I|O''OQ(CYO<<I|OOQO<<Hv<<HvOOQ07bAN?bAN?bOOQOAN?ZAN?ZO$=mQ08SOAN?ZOOQOAN>}AN>}O%[Q^OAN?ZOOQO<<Mr<<MrOOQUG27PG27PO!&dQ7[OG27PO#%sQWOG27PO''YQWOG27PO%0oQrOG27PO''bQ(CYO<<JdO''oQ(CYO1G2ZO')eQ(CYO,5?YO'+hQ(CYO,5?[O'-kQ(CYO1G2mO'/nQ(CYO1G2oO'1qQ(CYO<<KTO'2OQ(CYO<<IwOOQO1G1t1G1tO!(SQ7[OANAcOOQO7+*[7+*[O'2]QWO7+*[O'2hQWO<= _O'2pQpO7+*^OOQ07`<<Kl<<KlO$'ZQWO<<KlOOQ07`<<Kk<<KkO'2zQpO<<KlO$'ZQWO<<KkOOQO7+*k7+*kO9aQWO7+*kO'3RQWO<= hOOQUG27lG27lO9kQ07hOG27lO!*fQ^O1G4{O'3ZQWO7++yO&4QQWOANAzOOQUANAzANAzO!&dQ7[OANAzO'3cQWOANAzOOQUANA|ANA|O9kQ07hOANA|O$![QWOANA|OOQO'#HX'#HXOOQO7+*j7+*jOOQUG22vG22vOOQUANETANETOOQUANEUANEUOOQUANBUANBUO'3kQWOANBUOOQU<<MP<<MPO!*fQ^OAN?hOOQOG24uG24uO$=mQ08SOG24uO#%sQWOLD,kOOQULD,kLD,kO!&dQ7[OLD,kO'3pQWOLD,kO'3xQ(CYO7+'uO'5nQ(CYO,5?YO'7qQ(CYO,5?[O'9tQ(CYO7+'wO';jQ7[OG26}OOQO<<Mv<<MvOOQ07`ANAWANAWO$'ZQWOANAWOOQ07`ANAVANAVOOQO<<NV<<NVOOQULD-WLD-WO';zQ(CYO7+*gOOQUG27fG27fO&4QQWOG27fO!&dQ7[OG27fOOQUG27hG27hO9kQ07hOG27hOOQUG27pG27pO'<UQ(CYOG25SOOQOLD*aLD*aOOQU!$(!V!$(!VO#%sQWO!$(!VO!&dQ7[O!$(!VO'<`Q08SOG26}OOQ07`G26rG26rOOQULD-QLD-QO&4QQWOLD-QOOQULD-SLD-SOOQU!)9Eq!)9EqO#%sQWO!)9EqOOQU!$(!l!$(!lOOQU!.K;]!.K;]O'>qQ(CYOG26}O!*fQ^O'#DyO1PQWO'#EWO'@gQrO'#JiO!*fQ^O'#DqO'@nQ^O'#D}O'@uQrO'#ChO'C]QrO'#ChO!*fQ^O'#EPO'CmQ^O,5;VO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O'#IiO'EpQWO,5<eO'ExQ7[O,5;aO'GcQ7[O,5;aO!*fQ^O,5;uO!&dQ7[O'#GgO'ExQ7[O'#GgO!&dQ7[O'#GiO'ExQ7[O'#GiO1SQWO'#DVO1SQWO'#DVO!&dQ7[O'#FzO'ExQ7[O'#FzO!&dQ7[O'#F|O'ExQ7[O'#F|O!&dQ7[O'#G[O'ExQ7[O'#G[O!*fQ^O,5:iO!*fQ^O,5@eO'CmQ^O1G0qO'GjQ(CYO'#ChO!*fQ^O1G1|O!&dQ7[O'#InO'ExQ7[O'#InO!&dQ7[O'#IpO'ExQ7[O'#IpO!&dQ7[O,5<oO'ExQ7[O,5<oO'CmQ^O1G1}O!*fQ^O7+&xO!&dQ7[O1G2ZO'ExQ7[O1G2ZO!&dQ7[O'#InO'ExQ7[O'#InO!&dQ7[O'#IpO'ExQ7[O'#IpO!&dQ7[O1G2]O'ExQ7[O1G2]O'CmQ^O7+'iO'CmQ^O7+&]O!&dQ7[OANAcO'ExQ7[OANAcO'GtQWO'#EkO'GyQWO'#EkO'HRQWO'#FZO'HWQWO'#EuO'H]QWO'#JyO'HhQWO'#JwO'HsQWO,5;VO'HxQ7[O,5<bO'IPQWO'#GTO'IUQWO'#GTO'IZQWO,5<cO'IcQWO,5;VO'IkQ(CYO1G1^O'IrQWO,5<oO'IwQWO,5<oO'I|QWO,5<qO'JRQWO,5<qO'JWQWO1G1}O'J]QWO1G0qO'JbQ7[O<<KwO'JiQ7[O<<KwO7hQ7[O'#FxO9UQWO'#FwOA]QWO'#EjO!*fQ^O,5;rO!3fQWO'#GTO!3fQWO'#GTO!3fQWO'#GVO!3fQWO'#GVO!(SQ7[O7+(]O!(SQ7[O7+(]O%*yQpO1G2qO%*yQpO1G2qO!&dQ7[O,5=VO!&dQ7[O,5=V",
  stateData: "'Km~O'tOS'uOSSOS'vRQ~OPYOQYORfOX!VO`qOczOdyOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![XO!fuO!kZO!nYO!oYO!pYO!rvO!twO!wxO!{]O#s!PO$T|O%b}O%d!QO%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO%s!UO&P!WO&V!XO&X!YO&Z!ZO&]![O&`!]O&f!^O&l!_O&n!`O&p!aO&r!bO&t!cO'{SO'}TO(QUO(XVO(g[O(tiO~OVtO~P`OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~O`!vOo!nO!P!oO!_!xO!`!uO!a!uO!{:dO#P!pO#Q!pO#R!wO#S!pO#T!pO#W!yO#X!yO'|!lO'}TO(QUO([!mO(g!sO~O'v!zO~OP[XZ[X`[Xn[X|[X}[X!P[X!Y[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X'r[X(X[X(h[X(o[X(p[X~O!d$|X~P(qO^!|O'}#OO(O!|O(P#OO~O^#PO(P#OO(Q#OO(R#PO~Ot#RO!R#SO(Y#SO(Z#UO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{:hO'}TO(QUO(XVO(g[O(tiO~O!X#YO!Y#VO!V(_P!V(lP~P+}O!Z#bO~P`OPYOQYORfOc!jOd!iOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'}TO(QUO(XVO(g[O(tiO~Ol#lO!X#hO!{]O#e#kO#f#hO'{:iO!j(iP~P.iO!k#nO'{#mO~O!w#rO!{]O%b#sO~O#g#tO~O!d#uO#g#tO~OP$]OZ$dOn$QO|#yO}#zO!P#{O!Y$aO!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O`(]X'r(]X'p(]X!j(]X!V(]X![(]X%c(]X!d(]X~P1qO#[$eO$O$eOP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#r(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X![(^X%c(^X~O`(^X!i(^X'r(^X'p(^X!V(^X!j(^Xr(^X!d(^X~P4XO#[$eO~O$Y$gO$[$fO$c$lO~ORfO![$mO$f$nO$h$pO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz%ZO!P${O![$|O!f%`O!k$xO#f%aO$T%^O$o%[O$q%]O$t%_O'{$rO'}TO(QUO(X$uO(o$}O(p%POf(UP~O!k%bO~O!P%eO![%fO'{%dO~O!d%jO~O`%kO'r%kO~O'|!lO~P%[O%h%rO~P%[Og%VO!k%bO'{%dO'|!lO~Od%yO!k%bO'{%dO~O#r$SO~O|&OO![%{O!k%}O%d&RO'{%dO'|!lO'}TO(QUO_(}P~O!w#rO~O%m&TO!P(yX![(yX'{(yX~O'{&UO~O!t&ZO#s!PO%d!QO%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO~Oc&`Od&_O!w&]O%b&^O%u&[O~P;xOc&cOdyO![&bO!t&ZO!wxO!{]O#s!PO%b}O%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO%s!UO~Oa&fO#[&iO%d&dO'|!lO~P<}O!k&jO!t&nO~O!k#nO~O![XO~O`%kO'q&vO'r%kO~O`%kO'q&yO'r%kO~O`%kO'q&{O'r%kO~O'p[X!V[Xr[X!j[X&T[X![[X%c[X!d[X~P(qO!_'YO!`'RO!a'RO'|!lO'}TO(QUO~Oo'PO!P'OO!X'SO([&}O!Z(`P!Z(nP~P@UOj']O!['ZO'{%dO~Od'bO!k%bO'{%dO~O|&OO!k%}O~Oo!nO!P!oO!{:dO#P!pO#Q!pO#S!pO#T!pO'|!lO'}TO(QUO([!mO(g!sO~O!_'hO!`'gO!a'gO#R!pO#W'iO#X'iO~PApO`%kOg%VO!d#uO!k%bO'r%kO(h'kO~O!o'oO#['mO~PCOOo!nO!P!oO'}TO(QUO([!mO(g!sO~O![XOo(eX!P(eX!_(eX!`(eX!a(eX!{(eX#P(eX#Q(eX#R(eX#S(eX#T(eX#W(eX#X(eX'|(eX'}(eX(Q(eX([(eX(g(eX~O!`'gO!a'gO'|!lO~PCnO'w'sO'x'sO'y'uO~O^!|O'}'wO(O!|O(P'wO~O^#PO(P'wO(Q'wO(R#PO~Ot#RO!R#SO(Y#SO(Z'{O~O!X'}O!V'PX!V'VX!Y'PX!Y'VX~P+}O!Y(PO!V(_X~OP$]OZ$dOn$QO|#yO}#zO!P#{O!Y(PO!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O!V(_X~PGbO!V(UO~O!V(kX!Y(kX!d(kX!j(kX(h(kX~O#[(kX#g#`X!Z(kX~PIhO#[(VO!V(mX!Y(mX~O!Y(WO!V(lX~O!V(ZO~O#[$eO~PIhO!Z([O~P`O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!maZ!man!ma!Y!ma!h!ma!o!ma#j!ma#k!ma#l!ma#m!ma#n!ma#o!ma#p!ma#q!ma#r!ma#t!ma#v!ma#x!ma#y!ma(h!ma(o!ma(p!ma~O`!ma'r!ma'p!ma!V!ma!j!mar!ma![!ma%c!ma!d!ma~PKOO!j(]O~O!d#uO#[(^O(h'kO!Y(jX`(jX'r(jX~O!j(jX~PMnO!P%eO![%fO!{]O#e(cO#f(bO'{%dO~O!Y(dO!j(iX~O!j(fO~O!P%eO![%fO#f(bO'{%dO~OP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!i(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#r(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X~O!d#uO!j(^X~P! [O|(gO}(hO!i#wO!k#xO!{!za!P!za~O!w!za%b!za![!za#e!za#f!za'{!za~P!#`O!w(lO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![XO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~O#g(rO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz%ZO!P${O![$|O!f%`O!k$xO#f%aO$T%^O$o%[O$q%]O$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~Of(bP~P!(SO!X(vO!j(cP~P%[O([(xO(g[O~O!P(zO!k#xO([(xO(g[O~OP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![!eO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'{)YO'}TO(QUO(XVO(g[O(t<YO~O})]O!k#xO~O!Y$aO`$ma'r$ma'p$ma!j$ma!V$ma![$ma%c$ma!d$ma~O#s)aO~P!&dO|)dO!d)cO![$ZX$W$ZX$Y$ZX$[$ZX$c$ZX~O!d)cO![(qX$W(qX$Y(qX$[(qX$c(qX~O|)dO~P!.OO|)dO![(qX$W(qX$Y(qX$[(qX$c(qX~O![)fO$W)jO$Y)eO$[)eO$c)kO~O!X)nO~P!*fO$Y$gO$[$fO$c)rO~Oj$uX|$uX!P$uX!i$uX(o$uX(p$uX~OfiXf$uXjiX!YiX#[iX~P!/tOo)tO~Ot)uO(Y)vO(Z)xO~Oj*RO|)zO!P){O(o$}O(p%PO~Of)yO~P!0}Of*SO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'}TO(QUO(X$uO(o$}O(p%PO~O!X*WO'{*TO!j(uP~P!1lO#g*YO~O!k*ZO~O!X*`O'{*]O!V(vP~P!1lOn*lO!P*dO!_*jO!`*cO!a*cO!k*ZO#W*kO%Y*fO'|!lO([!mO~O!Z*iO~P!3xO!i#wOj(WX|(WX!P(WX(o(WX(p(WX!Y(WX#[(WX~Of(WX#|(WX~P!4qOj*qO#[*pOf(VX!Y(VX~O!Y*rOf(UX~O'{&UOf(UP~O!k*yO~O'{(pO~Ol*}O!P%eO!X#hO![%fO!{]O#e#kO#f#hO'{%dO!j(iP~O!d#uO#g+OO~O!P%eO!X+QO!Y(WO![%fO'{%dO!V(lP~Oo'VO!P+SO!X+RO'}TO(QUO([(xO~O!Z(nP~P!7lO!Y+TO`(zX'r(zX~OP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O`!ea!Y!ea'r!ea'p!ea!V!ea!j!ear!ea![!ea%c!ea!d!ea~P!8dO|#yO}#zO!P#{O!i#wO!k#xO(XVOP!qaZ!qan!qa!Y!qa!h!qa!o!qa#j!qa#k!qa#l!qa#m!qa#n!qa#o!qa#p!qa#q!qa#r!qa#t!qa#v!qa#x!qa#y!qa(h!qa(o!qa(p!qa~O`!qa'r!qa'p!qa!V!qa!j!qar!qa![!qa%c!qa!d!qa~P!:}O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!saZ!san!sa!Y!sa!h!sa!o!sa#j!sa#k!sa#l!sa#m!sa#n!sa#o!sa#p!sa#q!sa#r!sa#t!sa#v!sa#x!sa#y!sa(h!sa(o!sa(p!sa~O`!sa'r!sa'p!sa!V!sa!j!sar!sa![!sa%c!sa!d!sa~P!=hOg%VOj+^O!['ZO%c+]O~O!d+`O`(TX![(TX'r(TX!Y(TX~O`%kO![XO'r%kO~Og%VO!k%bO~Og%VO!k%bO'{%dO~O!d#uO#g(rO~Oa+kO%d+lO'{+hO'}TO(QUO!Z)OP~O!Y+mO_(}X~OZ+qO~O_+rO~O![%{O'{%dO'|!lO_(}P~Og%VO#[+wO~Og%VOj+zO![$|O~O![+|O~O|,OO![XO~O%h%rO~O!w,TO~Od,YO~Oa,ZO'{#mO'}TO(QUO!Z(|P~Od%yO~O%d!QO'{&UO~P<}OZ,`O_,_O~OPYOQYORfOczOdyOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO!fuO!kZO!nYO!oYO!pYO!rvO!wxO!{]O%b}O'}TO(QUO(XVO(g[O(tiO~O![!eO!t!gO$T!kO'{!dO~P!DkO_,_O`%kO'r%kO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~O`,eO!twO#s!OO%f!OO%g!OO%h!OO~P!GTO!k&jO~O&V,kO~O![,mO~O&h,oO&j,pOP&eaQ&eaR&eaX&ea`&eac&ead&eal&ean&eao&eap&eav&eax&eaz&ea!P&ea!T&ea!U&ea![&ea!f&ea!k&ea!n&ea!o&ea!p&ea!r&ea!t&ea!w&ea!{&ea#s&ea$T&ea%b&ea%d&ea%f&ea%g&ea%h&ea%k&ea%m&ea%p&ea%q&ea%s&ea&P&ea&V&ea&X&ea&Z&ea&]&ea&`&ea&f&ea&l&ea&n&ea&p&ea&r&ea&t&ea'p&ea'{&ea'}&ea(Q&ea(X&ea(g&ea(t&ea!Z&ea&^&eaa&ea&c&ea~O'{,uO~Og!bX!Y!OX!Y!bX!Z!OX!Z!bX!d!OX!d!bX!k!bX#[!OX~O!d,zO#[,yOg(aX!Y#dX!Y(aX!Z#dX!Z(aX!d(aX!k(aX~Og%VO!d,|O!k%bO!Y!^X!Z!^X~Oo!nO!P!oO'}TO(QUO([!mO~OP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![!eO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'}TO(QUO(XVO(g[O(t<YO~O'{;]O~P#!ZO!Y-QO!Z(`X~O!Z-SO~O!d,zO#[,yO!Y#dX!Z#dX~O!Y-TO!Z(nX~O!Z-VO~O!`-WO!a-WO'|!lO~P# xO!Z-ZO~P'_Oj-^O!['ZO~O!V-cO~Oo!za!_!za!`!za!a!za#P!za#Q!za#R!za#S!za#T!za#W!za#X!za'|!za'}!za(Q!za([!za(g!za~P!#`O!o-hO#[-fO~PCOO!`-jO!a-jO'|!lO~PCnO`%kO#[-fO'r%kO~O`%kO!d#uO#[-fO'r%kO~O`%kO!d#uO!o-hO#[-fO'r%kO(h'kO~O'w'sO'x'sO'y-oO~Or-pO~O!V'Pa!Y'Pa~P!8dO!X-tO!V'PX!Y'PX~P%[O!Y(PO!V(_a~O!V(_a~PGbO!Y(WO!V(la~O!P%eO!X-xO![%fO'{%dO!V'VX!Y'VX~O#[-zO!Y(ja!j(ja`(ja'r(ja~O!d#uO~P#*aO!Y(dO!j(ia~O!P%eO![%fO#f.OO'{%dO~Ol.TO!P%eO!X.QO![%fO!{]O#e.SO#f.QO'{%dO!Y'YX!j'YX~O}.XO!k#xO~Og%VOj.[O!['ZO%c.ZO~O`#_i!Y#_i'r#_i'p#_i!V#_i!j#_ir#_i![#_i%c#_i!d#_i~P!8dOj<fO|)zO!P){O(o$}O(p%PO~O#g#Za`#Za#[#Za'r#Za!Y#Za!j#Za![#Za!V#Za~P#-]O#g(WXP(WXZ(WX`(WXn(WX}(WX!h(WX!k(WX!o(WX#j(WX#k(WX#l(WX#m(WX#n(WX#o(WX#p(WX#q(WX#r(WX#t(WX#v(WX#x(WX#y(WX'r(WX(X(WX(h(WX!j(WX!V(WX'p(WXr(WX![(WX%c(WX!d(WX~P!4qO!Y.iOf(bX~P!0}Of.kO~O!Y.lO!j(cX~P!8dO!j.oO~O!V.qO~OP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O(XVOZ#ii`#iin#ii!Y#ii!h#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O#j#ii~P#1XO#j$OO~P#1XOP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO(XVOZ#ii`#ii!Y#ii!h#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~On#ii~P#3yOn$QO~P#3yOP$]On$QO|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO(XVO`#ii!Y#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~OZ#ii!h#ii#o#ii#p#ii#q#ii#r#ii~P#6kOZ$dO!h$SO#o$SO#p$SO#q$cO#r$SO~P#6kOP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO(XVO(p#}O`#ii!Y#ii#x#ii#y#ii'r#ii(h#ii(o#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O#v$VO~P#9lO#v#ii~P#9lOP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO(XVO`#ii!Y#ii#x#ii#y#ii'r#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O#v#ii(o#ii(p#ii~P#<^O#v$VO(o#|O(p#}O~P#<^OP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO(XVO(o#|O(p#}O~O`#ii!Y#ii#y#ii'r#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~P#?UOP[XZ[Xn[X|[X}[X!P[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X!Y[X!Z[X~O#|[X~P#AoOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO#v:sO#x:uO#y:vO(XVO(h$ZO(o#|O(p#}O~O#|.sO~P#C|O#[:{O$O:{O#|(^X!Z(^X~P! [O`']a!Y']a'r']a'p']a!j']a!V']ar']a![']a%c']a!d']a~P!8dOP#iiZ#ii`#iin#ii}#ii!Y#ii!h#ii!i#ii!k#ii!o#ii#j#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(X#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~P#-]O`#}i!Y#}i'r#}i'p#}i!V#}i!j#}ir#}i![#}i%c#}i!d#}i~P!8dO$Y.xO$[.xO~O$Y.yO$[.yO~O!d)cO#[.zO![$`X$W$`X$Y$`X$[$`X$c$`X~O!X.{O~O![)fO$W.}O$Y)eO$[)eO$c/OO~O!Y:wO!Z(]X~P#C|O!Z/PO~O!d)cO$c(qX~O$c/RO~Ot)uO(Y)vO(Z/UO~O!V/YO~P!&dO(o$}Oj%Za|%Za!P%Za(p%Za!Y%Za#[%Za~Of%Za#|%Za~P#L^O(p%POj%]a|%]a!P%]a(o%]a!Y%]a#[%]a~Of%]a#|%]a~P#MPO!YeX!deX!jeX!j$uX(heX~P!/tO!j/bO~P#-]O!Y/cO!d#uO(h'kO!j(uX~O!j/hO~O!X*WO'{%dO!j(uP~O#g/jO~O!V$uX!Y$uX!d$|X~P!/tO!Y/kO!V(vX~P#-]O!d/mO~O!V/oO~Og%VOn/sO!d#uO!k%bO(h'kO~O'{/uO~O!d+`O~O`%kO!Y/yO'r%kO~O!Z/{O~P!3xO!`/|O!a/|O'|!lO([!mO~O!P0OO([!mO~O#W0PO~Of%Za!Y%Za#[%Za#|%Za~P!0}Of%]a!Y%]a#[%]a#|%]a~P!0}O'{&UOf'fX!Y'fX~O!Y*rOf(Ua~Of0YO~O|0ZO}0ZO!P0[Ojya(oya(pya!Yya#[ya~Ofya#|ya~P$$jO|)zO!P){Oj$na(o$na(p$na!Y$na#[$na~Of$na#|$na~P$%`O|)zO!P){Oj$pa(o$pa(p$pa!Y$pa#[$pa~Of$pa#|$pa~P$&RO#g0^O~Of%Oa!Y%Oa#[%Oa#|%Oa~P!0}O!d#uO~O#g0aO~O!Y+TO`(za'r(za~O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!qiZ!qin!qi!Y!qi!h!qi!o!qi#j!qi#k!qi#l!qi#m!qi#n!qi#o!qi#p!qi#q!qi#r!qi#t!qi#v!qi#x!qi#y!qi(h!qi(o!qi(p!qi~O`!qi'r!qi'p!qi!V!qi!j!qir!qi![!qi%c!qi!d!qi~P$'pOg%VOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'}TO(QUO(X$uO(o$}O(p%PO~Ol0kO'{0jO~P$*ZO!d+`O`(Ta![(Ta'r(Ta!Y(Ta~O#g0qO~OZ[X!YeX!ZeX~O!Y0rO!Z)OX~O!Z0tO~OZ0uO~Oa0wO'{+hO'}TO(QUO~O![%{O'{%dO_'nX!Y'nX~O!Y+mO_(}a~O!j0zO~P!8dOZ0}O~O_1OO~O#[1RO~Oj1UO![$|O~O([(xO!Z({P~Og%VOj1_O![1[O%c1^O~OZ1iO!Y1gO!Z(|X~O!Z1jO~O_1lO`%kO'r%kO~O'{#mO'}TO(QUO~O#[$eO$O$eOP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X~O#r1oO&T1pO`(^X!i(^X~P$/qO#[$eO#r1oO&T1pO~O`1rO~P%[O`1tO~O&^1wOP&[iQ&[iR&[iX&[i`&[ic&[id&[il&[in&[io&[ip&[iv&[ix&[iz&[i!P&[i!T&[i!U&[i![&[i!f&[i!k&[i!n&[i!o&[i!p&[i!r&[i!t&[i!w&[i!{&[i#s&[i$T&[i%b&[i%d&[i%f&[i%g&[i%h&[i%k&[i%m&[i%p&[i%q&[i%s&[i&P&[i&V&[i&X&[i&Z&[i&]&[i&`&[i&f&[i&l&[i&n&[i&p&[i&r&[i&t&[i'p&[i'{&[i'}&[i(Q&[i(X&[i(g&[i(t&[i!Z&[ia&[i&c&[i~Oa1}O!Z1{O&c1|O~P`O![XO!k2PO~O&j,pOP&eiQ&eiR&eiX&ei`&eic&eid&eil&ein&eio&eip&eiv&eix&eiz&ei!P&ei!T&ei!U&ei![&ei!f&ei!k&ei!n&ei!o&ei!p&ei!r&ei!t&ei!w&ei!{&ei#s&ei$T&ei%b&ei%d&ei%f&ei%g&ei%h&ei%k&ei%m&ei%p&ei%q&ei%s&ei&P&ei&V&ei&X&ei&Z&ei&]&ei&`&ei&f&ei&l&ei&n&ei&p&ei&r&ei&t&ei'p&ei'{&ei'}&ei(Q&ei(X&ei(g&ei(t&ei!Z&ei&^&eia&ei&c&ei~O!V2VO~O!Y!^a!Z!^a~P#C|Oo!nO!P!oO!X2]O([!mO!Y'QX!Z'QX~P@UO!Y-QO!Z(`a~O!Y'WX!Z'WX~P!7lO!Y-TO!Z(na~O!Z2dO~P'_O`%kO#[2mO'r%kO~O`%kO!d#uO#[2mO'r%kO~O`%kO!d#uO!o2qO#[2mO'r%kO(h'kO~O`%kO'r%kO~P!8dO!Y$aOr$ma~O!V'Pi!Y'Pi~P!8dO!Y(PO!V(_i~O!Y(WO!V(li~O!V(mi!Y(mi~P!8dO!Y(ji!j(ji`(ji'r(ji~P!8dO#[2sO!Y(ji!j(ji`(ji'r(ji~O!Y(dO!j(ii~O!P%eO![%fO!{]O#e2xO#f2wO'{%dO~O!P%eO![%fO#f2wO'{%dO~Oj3PO!['ZO%c3OO~Og%VOj3PO!['ZO%c3OO~O#g%ZaP%ZaZ%Za`%Zan%Za}%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za'r%Za(X%Za(h%Za!j%Za!V%Za'p%Zar%Za![%Za%c%Za!d%Za~P#L^O#g%]aP%]aZ%]a`%]an%]a}%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a'r%]a(X%]a(h%]a!j%]a!V%]a'p%]ar%]a![%]a%c%]a!d%]a~P#MPO#g%ZaP%ZaZ%Za`%Zan%Za}%Za!Y%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za'r%Za(X%Za(h%Za!j%Za!V%Za'p%Za#[%Zar%Za![%Za%c%Za!d%Za~P#-]O#g%]aP%]aZ%]a`%]an%]a}%]a!Y%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a'r%]a(X%]a(h%]a!j%]a!V%]a'p%]a#[%]ar%]a![%]a%c%]a!d%]a~P#-]O#gyaPyaZya`yanya!hya!iya!kya!oya#jya#kya#lya#mya#nya#oya#pya#qya#rya#tya#vya#xya#yya'rya(Xya(hya!jya!Vya'pyarya![ya%cya!dya~P$$jO#g$naP$naZ$na`$nan$na}$na!h$na!i$na!k$na!o$na#j$na#k$na#l$na#m$na#n$na#o$na#p$na#q$na#r$na#t$na#v$na#x$na#y$na'r$na(X$na(h$na!j$na!V$na'p$nar$na![$na%c$na!d$na~P$%`O#g$paP$paZ$pa`$pan$pa}$pa!h$pa!i$pa!k$pa!o$pa#j$pa#k$pa#l$pa#m$pa#n$pa#o$pa#p$pa#q$pa#r$pa#t$pa#v$pa#x$pa#y$pa'r$pa(X$pa(h$pa!j$pa!V$pa'p$par$pa![$pa%c$pa!d$pa~P$&RO#g%OaP%OaZ%Oa`%Oan%Oa}%Oa!Y%Oa!h%Oa!i%Oa!k%Oa!o%Oa#j%Oa#k%Oa#l%Oa#m%Oa#n%Oa#o%Oa#p%Oa#q%Oa#r%Oa#t%Oa#v%Oa#x%Oa#y%Oa'r%Oa(X%Oa(h%Oa!j%Oa!V%Oa'p%Oa#[%Oar%Oa![%Oa%c%Oa!d%Oa~P#-]O`#_q!Y#_q'r#_q'p#_q!V#_q!j#_qr#_q![#_q%c#_q!d#_q~P!8dOf'RX!Y'RX~P!(SO!Y.iOf(ba~O!X3ZO!Y'SX!j'SX~P%[O!Y.lO!j(ca~O!Y.lO!j(ca~P!8dO!V3^O~O#|!ma!Z!ma~PKOO#|!ea!Y!ea!Z!ea~P#C|O#|!qa!Z!qa~P!:}O#|!sa!Z!sa~P!=hORfO![3pO$a3qO~O!Z3uO~Or3vO~P#-]O`$jq!Y$jq'r$jq'p$jq!V$jq!j$jqr$jq![$jq%c$jq!d$jq~P!8dO!V3wO~P#-]O|)zO!P){O(p%POj'ba(o'ba!Y'ba#['ba~Of'ba#|'ba~P%)eO|)zO!P){Oj'da(o'da(p'da!Y'da#['da~Of'da#|'da~P%*WO(h$ZO~P#-]O!X3zO'{%dO!Y'^X!j'^X~O!Y/cO!j(ua~O!Y/cO!d#uO!j(ua~O!Y/cO!d#uO(h'kO!j(ua~Of$wi!Y$wi#[$wi#|$wi~P!0}O!X4SO'{*]O!V'`X!Y'`X~P!1lO!Y/kO!V(va~O!Y/kO!V(va~P#-]O!d#uO#r4[O~On4_O!d#uO(h'kO~O(o$}Oj%Zi|%Zi!P%Zi(p%Zi!Y%Zi#[%Zi~Of%Zi#|%Zi~P%-jO(p%POj%]i|%]i!P%]i(o%]i!Y%]i#[%]i~Of%]i#|%]i~P%.]Of(Vi!Y(Vi~P!0}O#[4fOf(Vi!Y(Vi~P!0}O!j4iO~O`$kq!Y$kq'r$kq'p$kq!V$kq!j$kqr$kq![$kq%c$kq!d$kq~P!8dO!V4mO~O!Y4nO![(wX~P#-]O!i#wO~P4XO`$uX![$uX%W[X'r$uX!Y$uX~P!/tO%W4pO`kXjkX|kX!PkX![kX'rkX(okX(pkX!YkX~O%W4pO~Oa4vO%d4wO'{+hO'}TO(QUO!Y'mX!Z'mX~O!Y0rO!Z)Oa~OZ4{O~O_4|O~O`%kO'r%kO~P#-]O![$|O~P#-]O!Y5UO#[5WO!Z({X~O!Z5XO~Oo!nO!P5YO!_!xO!`!uO!a!uO!{:dO#P!pO#Q!pO#R!pO#S!pO#T!pO#W5_O#X!yO'|!lO'}TO(QUO([!mO(g!sO~O!Z5^O~P%3nOj5dO![1[O%c5cO~Og%VOj5dO![1[O%c5cO~Oa5kO'{#mO'}TO(QUO!Y'lX!Z'lX~O!Y1gO!Z(|a~O'}TO(QUO([5mO~O_5qO~O#r5tO&T5uO~PMnO!j5vO~P%[O`5xO~O`5xO~P%[Oa1}O!Z5}O&c1|O~P`O!d6PO~O!d6ROg(ai!Y(ai!Z(ai!d(ai!k(ai~O!Y#di!Z#di~P#C|O#[6SO!Y#di!Z#di~O!Y!^i!Z!^i~P#C|O`%kO#[6]O'r%kO~O`%kO!d#uO#[6]O'r%kO~O!Y(jq!j(jq`(jq'r(jq~P!8dO!Y(dO!j(iq~O!P%eO![%fO#f6dO'{%dO~O!['ZO%c6gO~Oj6jO!['ZO%c6gO~O#g'baP'baZ'ba`'ban'ba}'ba!h'ba!i'ba!k'ba!o'ba#j'ba#k'ba#l'ba#m'ba#n'ba#o'ba#p'ba#q'ba#r'ba#t'ba#v'ba#x'ba#y'ba'r'ba(X'ba(h'ba!j'ba!V'ba'p'bar'ba!['ba%c'ba!d'ba~P%)eO#g'daP'daZ'da`'dan'da}'da!h'da!i'da!k'da!o'da#j'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#t'da#v'da#x'da#y'da'r'da(X'da(h'da!j'da!V'da'p'dar'da!['da%c'da!d'da~P%*WO#g$wiP$wiZ$wi`$win$wi}$wi!Y$wi!h$wi!i$wi!k$wi!o$wi#j$wi#k$wi#l$wi#m$wi#n$wi#o$wi#p$wi#q$wi#r$wi#t$wi#v$wi#x$wi#y$wi'r$wi(X$wi(h$wi!j$wi!V$wi'p$wi#[$wir$wi![$wi%c$wi!d$wi~P#-]O#g%ZiP%ZiZ%Zi`%Zin%Zi}%Zi!h%Zi!i%Zi!k%Zi!o%Zi#j%Zi#k%Zi#l%Zi#m%Zi#n%Zi#o%Zi#p%Zi#q%Zi#r%Zi#t%Zi#v%Zi#x%Zi#y%Zi'r%Zi(X%Zi(h%Zi!j%Zi!V%Zi'p%Zir%Zi![%Zi%c%Zi!d%Zi~P%-jO#g%]iP%]iZ%]i`%]in%]i}%]i!h%]i!i%]i!k%]i!o%]i#j%]i#k%]i#l%]i#m%]i#n%]i#o%]i#p%]i#q%]i#r%]i#t%]i#v%]i#x%]i#y%]i'r%]i(X%]i(h%]i!j%]i!V%]i'p%]ir%]i![%]i%c%]i!d%]i~P%.]Of'Ra!Y'Ra~P!0}O!Y'Sa!j'Sa~P!8dO!Y.lO!j(ci~O#|#_i!Y#_i!Z#_i~P#C|OP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O(XVOZ#iin#ii!h#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~O#j#ii~P%FnO#j:lO~P%FnOP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO(XVOZ#ii!h#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~On#ii~P%HyOn:nO~P%HyOP$]On:nO|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO(XVO#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~OZ#ii!h#ii#o#ii#p#ii#q#ii#r#ii~P%KUOZ:zO!h:pO#o:pO#p:pO#q:yO#r:pO~P%KUOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO(XVO(p#}O#x#ii#y#ii#|#ii(h#ii(o#ii!Y#ii!Z#ii~O#v:sO~P%MpO#v#ii~P%MpOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO(XVO#x#ii#y#ii#|#ii(h#ii!Y#ii!Z#ii~O#v#ii(o#ii(p#ii~P& {O#v:sO(o#|O(p#}O~P& {OP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO#v:sO#x:uO(XVO(o#|O(p#}O~O#y#ii#|#ii(h#ii!Y#ii!Z#ii~P&$^O`#zy!Y#zy'r#zy'p#zy!V#zy!j#zyr#zy![#zy%c#zy!d#zy~P!8dOj<gO|)zO!P){O(o$}O(p%PO~OP#iiZ#iin#ii}#ii!h#ii!i#ii!k#ii!o#ii#j#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(X#ii(h#ii!Y#ii!Z#ii~P&'UO!i#wOP(WXZ(WXj(WXn(WX|(WX}(WX!P(WX!h(WX!k(WX!o(WX#j(WX#k(WX#l(WX#m(WX#n(WX#o(WX#p(WX#q(WX#r(WX#t(WX#v(WX#x(WX#y(WX#|(WX(X(WX(h(WX(o(WX(p(WX!Y(WX!Z(WX~O#|#}i!Y#}i!Z#}i~P#C|O#|!qi!Z!qi~P$'pO!Z6|O~O!Y']a!Z']a~P#C|O!d#uO(h'kO!Y'^a!j'^a~O!Y/cO!j(ui~O!Y/cO!d#uO!j(ui~Of$wq!Y$wq#[$wq#|$wq~P!0}O!V'`a!Y'`a~P#-]O!d7TO~O!Y/kO!V(vi~P#-]O!Y/kO!V(vi~O!V7XO~O!d#uO#r7^O~On7_O!d#uO(h'kO~O|)zO!P){O(p%POj'ca(o'ca!Y'ca#['ca~Of'ca#|'ca~P&.fO|)zO!P){Oj'ea(o'ea(p'ea!Y'ea#['ea~Of'ea#|'ea~P&/XO!V7aO~Of$yq!Y$yq#[$yq#|$yq~P!0}O`$ky!Y$ky'r$ky'p$ky!V$ky!j$kyr$ky![$ky%c$ky!d$ky~P!8dO!d6RO~O!Y4nO![(wa~O`#_y!Y#_y'r#_y'p#_y!V#_y!j#_yr#_y![#_y%c#_y!d#_y~P!8dOZ7fO~Oa7hO'{+hO'}TO(QUO~O!Y0rO!Z)Oi~O_7lO~O([(xO!Y'iX!Z'iX~O!Y5UO!Z({a~OlkO'{7sO~P.iO!Z7vO~P%3nOo!nO!P7wO'}TO(QUO([!mO(g!sO~O![1[O~O![1[O%c7yO~Oj7|O![1[O%c7yO~OZ8RO!Y'la!Z'la~O!Y1gO!Z(|i~O!j8VO~O!j8WO~O!j8ZO~O!j8ZO~P%[O`8]O~O!d8^O~O!j8_O~O!Y(mi!Z(mi~P#C|O`%kO#[8gO'r%kO~O!Y(jy!j(jy`(jy'r(jy~P!8dO!Y(dO!j(iy~O!['ZO%c8jO~O#g$wqP$wqZ$wq`$wqn$wq}$wq!Y$wq!h$wq!i$wq!k$wq!o$wq#j$wq#k$wq#l$wq#m$wq#n$wq#o$wq#p$wq#q$wq#r$wq#t$wq#v$wq#x$wq#y$wq'r$wq(X$wq(h$wq!j$wq!V$wq'p$wq#[$wqr$wq![$wq%c$wq!d$wq~P#-]O#g'caP'caZ'ca`'can'ca}'ca!h'ca!i'ca!k'ca!o'ca#j'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#t'ca#v'ca#x'ca#y'ca'r'ca(X'ca(h'ca!j'ca!V'ca'p'car'ca!['ca%c'ca!d'ca~P&.fO#g'eaP'eaZ'ea`'ean'ea}'ea!h'ea!i'ea!k'ea!o'ea#j'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#t'ea#v'ea#x'ea#y'ea'r'ea(X'ea(h'ea!j'ea!V'ea'p'ear'ea!['ea%c'ea!d'ea~P&/XO#g$yqP$yqZ$yq`$yqn$yq}$yq!Y$yq!h$yq!i$yq!k$yq!o$yq#j$yq#k$yq#l$yq#m$yq#n$yq#o$yq#p$yq#q$yq#r$yq#t$yq#v$yq#x$yq#y$yq'r$yq(X$yq(h$yq!j$yq!V$yq'p$yq#[$yqr$yq![$yq%c$yq!d$yq~P#-]O!Y'Si!j'Si~P!8dO#|#_q!Y#_q!Z#_q~P#C|O(o$}OP%ZaZ%Zan%Za}%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za#|%Za(X%Za(h%Za!Y%Za!Z%Za~Oj%Za|%Za!P%Za(p%Za~P&@nO(p%POP%]aZ%]an%]a}%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a#|%]a(X%]a(h%]a!Y%]a!Z%]a~Oj%]a|%]a!P%]a(o%]a~P&BuOj<gO|)zO!P){O(p%PO~P&@nOj<gO|)zO!P){O(o$}O~P&BuO|0ZO}0ZO!P0[OPyaZyajyanya!hya!iya!kya!oya#jya#kya#lya#mya#nya#oya#pya#qya#rya#tya#vya#xya#yya#|ya(Xya(hya(oya(pya!Yya!Zya~O|)zO!P){OP$naZ$naj$nan$na}$na!h$na!i$na!k$na!o$na#j$na#k$na#l$na#m$na#n$na#o$na#p$na#q$na#r$na#t$na#v$na#x$na#y$na#|$na(X$na(h$na(o$na(p$na!Y$na!Z$na~O|)zO!P){OP$paZ$paj$pan$pa}$pa!h$pa!i$pa!k$pa!o$pa#j$pa#k$pa#l$pa#m$pa#n$pa#o$pa#p$pa#q$pa#r$pa#t$pa#v$pa#x$pa#y$pa#|$pa(X$pa(h$pa(o$pa(p$pa!Y$pa!Z$pa~OP%OaZ%Oan%Oa}%Oa!h%Oa!i%Oa!k%Oa!o%Oa#j%Oa#k%Oa#l%Oa#m%Oa#n%Oa#o%Oa#p%Oa#q%Oa#r%Oa#t%Oa#v%Oa#x%Oa#y%Oa#|%Oa(X%Oa(h%Oa!Y%Oa!Z%Oa~P&'UO#|$jq!Y$jq!Z$jq~P#C|O#|$kq!Y$kq!Z$kq~P#C|O!Z8vO~O#|8wO~P!0}O!d#uO!Y'^i!j'^i~O!d#uO(h'kO!Y'^i!j'^i~O!Y/cO!j(uq~O!V'`i!Y'`i~P#-]O!Y/kO!V(vq~O!V8}O~P#-]O!V8}O~Of(Vy!Y(Vy~P!0}O!Y'ga!['ga~P#-]O`%Vq![%Vq'r%Vq!Y%Vq~P#-]OZ9SO~O!Y0rO!Z)Oq~O#[9WO!Y'ia!Z'ia~O!Y5UO!Z({i~P#C|OP[XZ[Xn[X|[X}[X!P[X!V[X!Y[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X~O!d%TX#r%TX~P'#`O![1[O%c9[O~O'}TO(QUO([9aO~O!Y1gO!Z(|q~O!j9dO~O!j9eO~O!j9fO~O!j9fO~P%[O#[9iO!Y#dy!Z#dy~O!Y#dy!Z#dy~P#C|O!['ZO%c9nO~O#|#zy!Y#zy!Z#zy~P#C|OP$wiZ$win$wi}$wi!h$wi!i$wi!k$wi!o$wi#j$wi#k$wi#l$wi#m$wi#n$wi#o$wi#p$wi#q$wi#r$wi#t$wi#v$wi#x$wi#y$wi#|$wi(X$wi(h$wi!Y$wi!Z$wi~P&'UO|)zO!P){O(p%POP'baZ'baj'ban'ba}'ba!h'ba!i'ba!k'ba!o'ba#j'ba#k'ba#l'ba#m'ba#n'ba#o'ba#p'ba#q'ba#r'ba#t'ba#v'ba#x'ba#y'ba#|'ba(X'ba(h'ba(o'ba!Y'ba!Z'ba~O|)zO!P){OP'daZ'daj'dan'da}'da!h'da!i'da!k'da!o'da#j'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#t'da#v'da#x'da#y'da#|'da(X'da(h'da(o'da(p'da!Y'da!Z'da~O(o$}OP%ZiZ%Zij%Zin%Zi|%Zi}%Zi!P%Zi!h%Zi!i%Zi!k%Zi!o%Zi#j%Zi#k%Zi#l%Zi#m%Zi#n%Zi#o%Zi#p%Zi#q%Zi#r%Zi#t%Zi#v%Zi#x%Zi#y%Zi#|%Zi(X%Zi(h%Zi(p%Zi!Y%Zi!Z%Zi~O(p%POP%]iZ%]ij%]in%]i|%]i}%]i!P%]i!h%]i!i%]i!k%]i!o%]i#j%]i#k%]i#l%]i#m%]i#n%]i#o%]i#p%]i#q%]i#r%]i#t%]i#v%]i#x%]i#y%]i#|%]i(X%]i(h%]i(o%]i!Y%]i!Z%]i~O#|$ky!Y$ky!Z$ky~P#C|O#|#_y!Y#_y!Z#_y~P#C|O!d#uO!Y'^q!j'^q~O!Y/cO!j(uy~O!V'`q!Y'`q~P#-]O!V9wO~P#-]O!Y0rO!Z)Oy~O!Y5UO!Z({q~O![1[O%c:OO~O!j:RO~O!['ZO%c:WO~OP$wqZ$wqn$wq}$wq!h$wq!i$wq!k$wq!o$wq#j$wq#k$wq#l$wq#m$wq#n$wq#o$wq#p$wq#q$wq#r$wq#t$wq#v$wq#x$wq#y$wq#|$wq(X$wq(h$wq!Y$wq!Z$wq~P&'UO|)zO!P){O(p%POP'caZ'caj'can'ca}'ca!h'ca!i'ca!k'ca!o'ca#j'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#t'ca#v'ca#x'ca#y'ca#|'ca(X'ca(h'ca(o'ca!Y'ca!Z'ca~O|)zO!P){OP'eaZ'eaj'ean'ea}'ea!h'ea!i'ea!k'ea!o'ea#j'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#t'ea#v'ea#x'ea#y'ea#|'ea(X'ea(h'ea(o'ea(p'ea!Y'ea!Z'ea~OP$yqZ$yqn$yq}$yq!h$yq!i$yq!k$yq!o$yq#j$yq#k$yq#l$yq#m$yq#n$yq#o$yq#p$yq#q$yq#r$yq#t$yq#v$yq#x$yq#y$yq#|$yq(X$yq(h$yq!Y$yq!Z$yq~P&'UOf%_!Z!Y%_!Z#[%_!Z#|%_!Z~P!0}O!Y'iq!Z'iq~P#C|O!Y#d!Z!Z#d!Z~P#C|O#g%_!ZP%_!ZZ%_!Z`%_!Zn%_!Z}%_!Z!Y%_!Z!h%_!Z!i%_!Z!k%_!Z!o%_!Z#j%_!Z#k%_!Z#l%_!Z#m%_!Z#n%_!Z#o%_!Z#p%_!Z#q%_!Z#r%_!Z#t%_!Z#v%_!Z#x%_!Z#y%_!Z'r%_!Z(X%_!Z(h%_!Z!j%_!Z!V%_!Z'p%_!Z#[%_!Zr%_!Z![%_!Z%c%_!Z!d%_!Z~P#-]OP%_!ZZ%_!Zn%_!Z}%_!Z!h%_!Z!i%_!Z!k%_!Z!o%_!Z#j%_!Z#k%_!Z#l%_!Z#m%_!Z#n%_!Z#o%_!Z#p%_!Z#q%_!Z#r%_!Z#t%_!Z#v%_!Z#x%_!Z#y%_!Z#|%_!Z(X%_!Z(h%_!Z!Y%_!Z!Z%_!Z~P&'UOr(]X~P1qO'|!lO~P!*fO!VeX!YeX#[eX~P'#`OP[XZ[Xn[X|[X}[X!P[X!Y[X!YeX!h[X!i[X!k[X!o[X#[[X#[eX#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X~O!deX!j[X!jeX(heX~P'ASOP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![XO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'{)YO'}TO(QUO(XVO(g[O(t<YO~O!Y:wO!Z$ma~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;RO!P${O![$|O!f<aO!k$xO#f;XO$T%^O$o;TO$q;VO$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~O#s)aO~P'ExO!Z[X!ZeX~P'ASO#g:kO~O!d#uO#g:kO~O#[:{O~O#r:pO~O#[;ZO!Y(mX!Z(mX~O#[:{O!Y(kX!Z(kX~O#g;[O~Of;^O~P!0}O#g;cO~O#g;dO~O!d#uO#g;eO~O!d#uO#g;[O~O#|;fO~P#C|O#g;gO~O#g;hO~O#g;mO~O#g;nO~O#g;oO~O#g;pO~O#|;qO~P!0}O#|;rO~P!0}O!i#P#Q#S#T#W#e#f#q(t$o$q$t%W%b%c%d%k%m%p%q%s%u~'vS#k!U't'|#lo#j#mn|'u$Y'u'{$[([~",
  goto: "$2p)SPPPPP)TPP)WP)iP*x.|PPPP5pPP6WPP<S?gP?zP?zPPP?zPAxP?zP?zP?zPA|PPBRPBlPGdPPPGhPPPPGhJiPPPJoKjPGhPMxPPPP!!WGhPPPGhPGhP!$fGhP!'z!(|!)VP!)y!)}!)yPPPPP!-Y!(|PP!-v!.pP!1dGhGh!1i!4s!9Y!9Y!=OPPP!=VGhPPPPPPPPPPP!@dP!AqPPGh!CSPGhPGhGhGhGhPGh!DfP!GnP!JrP!Jv!KQ!KU!KUP!GkP!KY!KYP!N^P!NbGhGh!Nh##k?zP?zP?z?zP#$v?z?z#'O?z#)k?z#+m?z?z#,[#.f#.f#.j#.r#.f#.zP#.fP?z#/d?z#3R?z?z5pPPP#6vPPP#7a#7aP#7aP#7w#7aPP#7}P#7tP#7t#8b#7t#8|#9S5m)W#9V)WP#9^#9^#9^P)WP)WP)WP)WPP)WP#9d#9gP#9g)WP#9kP#9nP)WP)WP)WP)WP)WP)W)WPP#9t#9z#:V#:]#:c#:i#:o#:}#;T#;Z#;e#;k#;u#<U#<[#<|#=`#=f#=l#=z#>a#@O#@^#@d#Ax#BW#Cr#DQ#DW#D^#Dd#Dn#Dt#Dz#EU#Eh#EnPPPPPPPPPP#EtPPPPPPP#Fi#Ip#KP#KW#K`PPPP$!d$%Z$+r$+u$+x$,q$,t$,w$-O$-WPP$-^$-b$.Y$/X$/]$/qPP$/u$/{$0PP$0S$0W$0Z$1P$1h$2P$2T$2W$2Z$2a$2d$2h$2lR!{RoqOXst!Z#c%j&m&o&p&r,h,m1w1zY!uQ'Z-Y1[5]Q%pvQ%xyQ&P|Q&e!VS'R!e-QQ'a!iS'g!r!xS*c$|*hQ+f%yQ+s&RQ,X&_Q-W'YQ-b'bQ-j'hQ/|*jQ1f,YR;Y:g%OdOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S,e,h,m-^-f-t-z.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3Z5Y5d5t5u5x6]7w7|8]8gS#p]:d!r)[$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q*u%ZQ+k%{Q,Z&bQ,b&jQ.c;QQ0h+^Q0l+`Q0w+lQ1n,`Q2{.[Q4v0rQ5k1gQ6i3PQ6u;RQ7h4wR8m6j&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]t!nQ!r!u!x!y'R'Y'Z'g'h'i-Q-W-Y-j1[5]5_$v$si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gQ&S|Q'P!eS'V%f-TQ+k%{Q,Z&bQ0]*yQ0w+lQ0|+rQ1m,_Q1n,`Q4v0rQ5P1OQ5k1gQ5n1iQ5o1lQ7h4wQ7k4|Q8U5qQ9V7lR9b8RrnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zR,]&f&v^OPXYstuvwz!Z!`!g!j!o#R#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O']'m(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<[<][#[WZ#V#Y'S'}!S%gm#g#h#k%b%e(W(b(c(d+Q+R+T,d,z-x.O.P.Q.S2P2w2x6R6dQ%sxQ%wyS%||&RQ&Y!TQ'^!hQ'`!iQ(k#rS*V$x*ZS+e%x%yQ+i%{Q,S&]Q,W&_S-a'a'bQ.^(lQ/g*WQ0p+fQ0v+lQ0x+mQ0{+qQ1a,TS1e,X,YQ2i-bQ3y/cQ4u0rQ4y0uQ5O0}Q5j1fQ7Q3zQ7g4wQ7j4{Q9R7fR9y9S!O$zi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c!S%uy!i!t%w%x%y'Q'`'a'b'f'p*b+e+f,}-a-b-i/t0p2b2i2p4^Q+_%sQ+x&VQ+{&WQ,V&_Q.](kQ1`,SU1d,W,X,YQ3Q.^Q5e1aS5i1e1fQ8Q5j#W<^#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<go<_:y:z:};P;T;V;X;`;b;d;h;j;l;n;rW%Ti%V*r<YS&V!Q&dQ&W!RQ&X!SR+v&T$w%Si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gT)v$u)wV*v%Z;Q;RU'V!e%f-TS(y#y#zQ+p&OS.V(g(hQ1V+|Q4g0ZR7p5U&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]$i$`c#X#d%n%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.t.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PT#SV#T&}kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q'T!eR2^-Qv!nQ!e!r!u!x!y'R'Y'Z'g'h'i-Q-W-Y-j1[5]5_S*b$|*hS/t*c*jQ/}*kQ1X,OQ4^/|R4a0PnqOXst!Z#c%j&m&o&p&r,h,m1w1zQ&t!^Q'q!wS(m#t:kQ+c%vQ,Q&YQ,R&[Q-_'_Q-l'jS.g(r;[S0`+O;eQ0n+dQ1Z,PQ2O,oQ2Q,pQ2Y,{Q2g-`Q2j-dS4l0a;oQ4q0oS4t0q;pQ6T2[Q6X2hQ6^2oQ7e4rQ8b6VQ8c6YQ8f6_R9h8_$d$_c#X#d%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PS(j#o'dU*o%R(q3mS+Y%n.tQ2|0hQ6f2{Q8l6iR9o8m$d$^c#X#d%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PS(i#o'dS({#z$_S+X%n.tS.W(h(jQ.w)]Q0e+YR2y.X&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]S#p]:dQ&o!XQ&p!YQ&r![Q&s!]R1v,kQ'[!hQ+[%sQ-]'^S.Y(k+_Q2e-[W2}.].^0g0iQ6W2fU6e2z2|3QS8i6f6hS9m8k8lS:U9l9oQ:^:VR:a:_U!vQ'Z-YT5Z1[5]!Q_OXZ`st!V!Z#c#g%b%j&d&f&m&o&p&r(d,h,m.P1w1z]!pQ!r'Z-Y1[5]T#p]:d%Y{OPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gS(y#y#zS.V(g(h!s;v$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Y!tQ'Z-Y1[5]Q'f!rS'p!u!xS'r!y5_S-i'g'hQ-k'iR2p-jQ'o!tS(`#f1qS-h'f'rQ/f*VQ/r*bQ2q-kQ4O/gS4X/s/}Q7P3yS7[4_4aQ8y7QR9Q7_Q#vbQ'n!tS(_#f1qS(a#l*}Q+P%cQ+a%tQ+g%zU-g'f'o'rQ-{(`Q/e*VQ/q*bQ/w*eQ0m+bQ1b,US2n-h-kQ2v.TS3}/f/gS4W/r/}Q4Z/vQ4]/xQ5g1cQ6`2qQ7O3yQ7S4OS7W4X4aQ7]4`Q8O5hS8x7P7QQ8|7XQ9O7[Q9_8PQ9u8yQ9v8}Q9x9QQ:Q9`Q:Y9wQ;y;tQ<U;}R<V<OV!vQ'Z-Y%YaOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gS#vz!j!r;s$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]R;y<[%YbOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gQ%cj!S%ty!i!t%w%x%y'Q'`'a'b'f'p*b+e+f,}-a-b-i/t0p2b2i2p4^S%zz!jQ+b%uQ,U&_W1c,V,W,X,YU5h1d1e1fS8P5i5jQ9`8Q!r;t$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q;}<ZR<O<[$|eOPXYstuvw!Z!`!g!o#R#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gY#aWZ#V#Y'}!S%gm#g#h#k%b%e(W(b(c(d+Q+R+T,d,z-x.O.P.Q.S2P2w2x6R6dQ,c&j!p;u$[$m)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]R;x'SS'W!e%fR2`-T%OdOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S,e,h,m-^-f-t-z.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3Z5Y5d5t5u5x6]7w7|8]8g!r)[$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q,b&jQ0h+^Q2{.[Q6i3PR8m6j!b$Uc#X%n'|(S(n(u)W)X)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:e!P:r)Z)l-O.t2W2Z3_3i3j3n3t6U6p6y6z7r8a8n8t8u9{:S<P!f$Wc#X%n'|(S(n(u)T)U)W)X)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:e!T:t)Z)l-O.t2W2Z3_3f3g3i3j3n3t6U6p6y6z7r8a8n8t8u9{:S<P!^$[c#X%n'|(S(n(u)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:eQ3x/az<])Z)l-O.t2W2Z3_3n3t6U6p6y6z7r8a8n8t8u9{:S<PQ<b<dR<c<e&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]S$nh$oR3q.z'TgOPWXYZhstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m$o%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.z.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]T$jf$pQ$hfS)e$k)iR)q$pT$if$pT)g$k)i'ThOPWXYZhstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m$o%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.z.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]T$nh$oQ$qhR)p$o%YjOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8g!s<Z$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]#clOPXZst!Z!`!o#R#c#n#{$m%j&f&i&j&m&o&p&r&v'O'](z)n+S+^,e,h,m-^.[.{0[1_1o1p1r1t1w1z1|3P3p5Y5d5t5u5x6j7w7|8]!O%Ri#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c#W(q#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gQ*z%_Q/W)zo3m:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!O$yi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cQ*[$zS*e$|*hQ*{%`Q/x*f#W;{#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn;|:y:z:};P;T;V;X;`;b;d;h;j;l;n;rQ<Q<^Q<R<_Q<S<`R<T<a!O%Ri#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c#W(q#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<go3m:y:z:};P;T;V;X;`;b;d;h;j;l;n;rnoOXst!Z#c%j&m&o&p&r,h,m1w1zQ*_${Q,v&yQ,w&{R4R/k$v%Si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gQ+y&WQ1T+{Q5S1SR7o5TT*g$|*hS*g$|*hT5[1[5]S/v*d5YT4`0O7wQ+a%tQ/w*eQ0m+bQ1b,UQ5g1cQ8O5hQ9_8PR:Q9`!O%Oi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cr)}$v(s*O*n*|/i0U0V3W4P4j6}7`9t;z<W<XS0Q*m0R#W:|#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn:}:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!^;_(o)`*U*^._.b.f/S/X/a/n0f1Q1S3T4Q4U5R5T6k6n7U7Y7b7d8{9P:X<d<e`;`3l6q6t6x8o9p9s:bS;i.a3UT;j6s8r!O%Qi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cv*P$v(s*Q*m*|/]/i0U0V3W4P4b4j6}7`9t;z<W<XS0S*n0T#W;O#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn;P:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!b;a(o)`*U*^.`.a.f/S/X/a/n0f1Q1S3R3T4Q4U5R5T6k6l6n7U7Y7b7d8{9P:X<d<ed;b3l6r6s6x8o8p9p9q9s:bS;k.b3VT;l6t8srnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zQ&a!UR,e&jrnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zR&a!UQ+}&XR1P+vsnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zQ1],SS5b1`1aU7x5`5a5eS9Z7z7{S9|9Y9]Q:Z9}R:`:[Q&h!VR,^&dR5n1iS%||&RR0x+mQ&m!WR,h&nR,n&sT1x,m1zR,r&tQ,q&tR2R,rQ't!zR-n'tSsOtQ#cXT%ms#cQ!}TR'v!}Q#QUR'x#QQ)w$uR/T)wQ#TVR'z#TQ#WWU(Q#W(R-uQ(R#XR-u(SQ-R'TR2_-RQ.j(sR3X.jQ.m(uS3[.m3]R3].nQ-Y'ZR2c-YY!rQ'Z-Y1[5]R'e!rS#^W%eU(X#^(Y-vQ(Y#_R-v(TQ-U'WR2a-Ut`OXst!V!Z#c%j&d&f&m&o&p&r,h,m1w1zS#gZ%bU#q`#g.PR.P(dQ(e#iQ-|(aW.U(e-|2t6bQ2t-}R6b2uQ)i$kR.|)iQ$ohR)o$oQ$bcU)_$b-q:xQ-q:eR:x)lQ/d*VW3{/d3|7R8zU3|/e/f/gS7R3}4OR8z7S$X)|$v(o(s)`*U*^*m*n*w*x*|.a.b.d.e.f/S/X/]/_/a/i/n0U0V0f1Q1S3R3S3T3W3l4P4Q4U4b4d4j5R5T6k6l6m6n6s6t6v6w6x6}7U7Y7`7b7d8o8p8q8{9P9p9q9r9s9t:X:b;z<W<X<d<eQ/l*^U4T/l4V7VQ4V/nR7V4UQ*h$|R/z*hr*O$v(s*m*n*|/i0U0V3W4P4j6}7`9t;z<W<X!^._(o)`*U*^.a.b.f/S/X/a/n0f1Q1S3T4Q4U5R5T6k6n7U7Y7b7d8{9P:X<d<eU/^*O._6qa6q3l6s6t6x8o9p9s:bQ0R*mQ3U.aU4c0R3U8rR8r6sv*Q$v(s*m*n*|/]/i0U0V3W4P4b4j6}7`9t;z<W<X!b.`(o)`*U*^.a.b.f/S/X/a/n0f1Q1S3R3T4Q4U5R5T6k6l6n7U7Y7b7d8{9P:X<d<eU/`*Q.`6re6r3l6s6t6x8o8p9p9q9s:bQ0T*nQ3V.bU4e0T3V8sR8s6tQ*s%UR0X*sQ4o0fR7c4oQ+U%hR0d+UQ5V1VS7q5V9XR9X7rQ,P&YR1Y,PQ5]1[R7u5]Q1h,ZS5l1h8SR8S5nQ0s+iW4x0s4z7i9TQ4z0vQ7i4yR9T7jQ+n%|R0y+nQ1z,mR5|1zYrOXst#cQ&q!ZQ+W%jQ,g&mQ,i&oQ,j&pQ,l&rQ1u,hS1x,m1zR5{1wQ%lpQ&u!_Q&x!aQ&z!bQ&|!cQ'l!tQ+V%iQ+c%vQ+u&SQ,]&hQ,t&wW-e'f'n'o'rQ-l'jQ/y*gQ0n+dS1k,^,aQ2S,sQ2T,vQ2U,wQ2j-dW2l-g-h-k-mQ4q0oQ4}0|Q5Q1QQ5f1bQ5p1mQ5z1vU6Z2k2n2qQ6^2oQ7e4rQ7m5PQ7n5RQ7t5[Q7}5gQ8T5oS8d6[6`Q8f6_Q9U7kQ9^8OQ9c8UQ9j8eQ9z9VQ:P9_Q:T9kR:]:QQ%vyQ'_!iQ'j!tU+d%w%x%yQ,{'QU-`'`'a'bS-d'f'pQ/p*bS0o+e+fQ2[,}S2h-a-bQ2o-iQ4Y/tQ4r0pQ6V2bQ6Y2iQ6_2pR7Z4^S$wi<YR*t%VU%Ui%V<YR0W*rQ$viS(o#u+`Q(s#wS)`$c$dQ*U$xQ*^${Q*m%OQ*n%QQ*w%[Q*x%]Q*|%aQ.a:|Q.b;OQ.d;SQ.e;UQ.f;WQ/S)uS/X){/ZQ/])}Q/_*PQ/a*RQ/i*YQ/n*`Q0U*pQ0V*qh0f+].Z1^3O5c6g7y8j9[9n:O:WQ1Q+wQ1S+zQ3R;_Q3S;aQ3T;cQ3W.iS3l:y:zQ4P/jQ4Q/kQ4U/mQ4b0QQ4d0SQ4j0^Q5R1RQ5T1UQ6k;gQ6l;iQ6m;kQ6n;mQ6s:}Q6t;PQ6v;TQ6w;VQ6x;XQ6}3xQ7U4SQ7Y4[Q7`4fQ7b4nQ7d4pQ8o;dQ8p;`Q8q;bQ8{7TQ9P7^Q9p;hQ9q;jQ9r;lQ9s;nQ9t8wQ:X;qQ:b;rQ;z<YQ<W<bQ<X<cQ<d<fR<e<gnpOXst!Z#c%j&m&o&p&r,h,m1w1zQ!fPS#eZ#nQ&w!`U'c!o5Y7wQ'y#RQ(|#{Q)m$mS,a&f&iQ,f&jQ,s&vQ,x'OQ-[']Q.p(zQ/Q)nQ0b+SQ0i+^Q1s,eQ2f-^Q2|.[Q3s.{Q4h0[Q5a1_Q5r1oQ5s1pQ5w1rQ5y1tQ6O1|Q6f3PQ6{3pQ7{5dQ8X5tQ8Y5uQ8[5xQ8l6jQ9]7|R9g8]#WcOPXZst!Z!`!o#c#n#{%j&f&i&j&m&o&p&r&v'O'](z+S+^,e,h,m-^.[0[1_1o1p1r1t1w1z1|3P5Y5d5t5u5x6j7w7|8]Q#XWQ#dYQ%nuQ%ovS%qw!gS'|#V(PQ(S#YQ(n#tQ(u#xQ(}$OQ)O$PQ)P$QQ)Q$RQ)R$SQ)S$TQ)T$UQ)U$VQ)V$WQ)W$XQ)X$YQ)Z$[Q)^$aQ)b$eW)l$m)n.{3pQ+Z%pQ+o%}S-O'S2]Q-m'mS-r'}-tQ-w(VQ-y(^Q.h(rQ.n(vQ.r:cQ.t:fQ.u:gQ.v:jQ/V)yQ0_+OQ2W,yQ2Z,|Q2k-fQ2r-zQ3Y.lQ3_:kQ3`:lQ3a:mQ3b:nQ3c:oQ3d:pQ3e:qQ3f:rQ3g:sQ3h:tQ3i:uQ3j:vQ3k.sQ3n:{Q3o;YQ3t:wQ4k0aQ4s0qQ6U;ZQ6[2mQ6a2sQ6o3ZQ6p;[Q6y;^Q6z;eQ7r5WQ8a6SQ8e6]Q8n;fQ8t;oQ8u;pQ9k8gQ9{9WQ:S9iQ:e#RR<P<]R#ZWR'U!eY!tQ'Z-Y1[5]S'Q!e-QQ'f!rS'p!u!xS'r!y5_S,}'R'YS-i'g'hQ-k'iQ2b-WR2p-jR(t#wR(w#xQ!fQT-X'Z-Y]!qQ!r'Z-Y1[5]Q#o]R'd:dT#jZ%bS#iZ%bS%hm,dU(a#g#h#kS-}(b(cQ.R(dQ0c+TQ2u.OU2v.P.Q.SS6c2w2xR8h6d`#]W#V#Y%e'}(W+Q-xr#fZm#g#h#k%b(b(c(d+T.O.P.Q.S2w2x6dQ1q,dQ2X,zQ6Q2PQ8`6RT;w'S+RT#`W%eS#_W%eS(O#V(WS(T#Y+QS-P'S+RT-s'}-xT'X!e%fQ$kfR)s$pT)h$k)iR3r.zT*X$x*ZR*a${Q0g+]Q2z.ZQ5`1^Q6h3OQ7z5cQ8k6gQ9Y7yQ9l8jQ9}9[Q:V9nQ:[:OR:_:WnqOXst!Z#c%j&m&o&p&r,h,m1w1zQ&g!VR,]&dtmOXst!U!V!Z#c%j&d&m&o&p&r,h,m1w1zR,d&jT%im,dR1W+|R,[&bQ&Q|R+t&RR+j%{T&k!W&nT&l!W&nT1y,m1z",
  nodeNames: "⚠ ArithOp ArithOp JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . ?. PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewExpression new TypeArgList CompareOp < ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies in const CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast ArrowFunction TypeParamList SequenceExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 371,
  context: trackNewline,
  nodeProps: [
    ["isolate", -8, 4, 5, 13, 33, 35, 48, 50, 52, ""],
    ["group", -26, 8, 16, 18, 65, 201, 205, 209, 210, 212, 215, 218, 228, 230, 236, 238, 240, 242, 245, 251, 257, 259, 261, 263, 265, 267, 268, "Statement", -32, 12, 13, 28, 31, 32, 38, 48, 51, 52, 54, 59, 67, 75, 79, 81, 83, 84, 106, 107, 116, 117, 134, 137, 139, 140, 141, 142, 144, 145, 164, 165, 167, "Expression", -23, 27, 29, 33, 37, 39, 41, 168, 170, 172, 173, 175, 176, 177, 179, 180, 181, 183, 184, 185, 195, 197, 199, 200, "Type", -3, 87, 99, 105, "ClassItem"],
    ["openedBy", 22, "<", 34, "InterpolationStart", 53, "[", 57, "{", 72, "(", 157, "JSXStartCloseTag"],
    ["closedBy", 23, ">", 36, "InterpolationEnd", 47, "]", 58, "}", 73, ")", 162, "JSXEndTag"]
  ],
  propSources: [jsHighlight],
  skippedNodes: [0, 4, 5, 271],
  repeatNodeCount: 37,
  tokenData: "$Fj(CSR!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#8g!R![#:v![!]#Gv!]!^#IS!^!_#J^!_!`#Ns!`!a$#_!a!b$(l!b!c$,k!c!}Er!}#O$-u#O#P$/P#P#Q$4h#Q#R$5r#R#SEr#S#T$7P#T#o$8Z#o#p$<k#p#q$=a#q#r$>q#r#s$?}#s$f%Z$f$g+g$g#BYEr#BY#BZ$AX#BZ$ISEr$IS$I_$AX$I_$I|Er$I|$I}$Dd$I}$JO$Dd$JO$JTEr$JT$JU$AX$JU$KVEr$KV$KW$AX$KW&FUEr&FU&FV$AX&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$AX?HUOEr(n%d_$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$f&j(R!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(R!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$f&j(OpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(OpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z(CS+rq$f&j(Op(R!b't(;dOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z(CS.ST(P#S$f&j'u(;dO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c(CS.n_$f&j(Op(R!b'u(;dOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`/x`$f&j!o$Ip(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S1V`#t$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S2d_#t$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/|3l_'}$(n$f&j(R!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$f&j(R!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$f&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$a`$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$a``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$a`$f&j(R!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(R!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$a`(R!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k#%|:hh$f&j(Op(R!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__VS$f&j(Op(R!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]VS$f&j(R!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXVS$f&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSVSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWVS(R!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]VS$f&j(OpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWVS(OpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYVS(Op(R!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S#%|C}i$f&j(g!L^(Op(R!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr#%|EoP;=`<%lCr(CSFRk$f&j(Op(R!b$Y#t'{&;d([!LYOY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$f&j(Op(R!b$Y#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv(CSJPP;=`<%lEr%#SJ_`$f&j(Op(R!b#l$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#SKl_$f&j$O$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&COLva(p&;`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#SNW`$f&j#x$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/|! c_(Q$)`$f&j(OpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$f&j(OpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$f&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$a`$f&j(OpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(OpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$a`(OpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b(*Q!'t_!k(!b$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'l!)O_!jM|$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+h!*[b$f&j(Op(R!b'|#)d#m$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S!+o`$f&j(Op(R!b#j$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&-O!,|`$f&j(Op(R!bn&%`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&C[!.Z_!Y&;l$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS!/ec$f&j(Op(R!b|'<nOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'d!0ya$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'d!2Z_!XMt$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!3eg$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!5Vg$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!6wc$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!8_c$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS!9uf$f&j(Op(R!b#k$IdOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpxz!;Zz{#,f{!P!;Z!P!Q#-{!Q!^!;Z!^!_#'Z!_!`#5k!`!a#7Q!a!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(r!;fb$f&j(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(Q!<w`$f&j(R!b!USOY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eb!Q!^!<n!^!_!GY!_!}!<n!}#O!Ja#O#P!Dj#P#o!<n#o#p!GY#p;'S!<n;'S;=`!Kj<%lO!<n&n!>Q^$f&j!USOY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@Y!_!}!=y!}#O!Bw#O#P!Dj#P#o!=y#o#p!@Y#p;'S!=y;'S;=`!E[<%lO!=y&n!?Ta$f&j!USO!^&c!_#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&cS!@_X!USOY!@YZ!P!@Y!P!Q!@z!Q!}!@Y!}#O!Ac#O#P!Bb#P;'S!@Y;'S;=`!Bq<%lO!@YS!APU!US#Z#[!@z#]#^!@z#a#b!@z#g#h!@z#i#j!@z#m#n!@zS!AfVOY!AcZ#O!Ac#O#P!A{#P#Q!@Y#Q;'S!Ac;'S;=`!B[<%lO!AcS!BOSOY!AcZ;'S!Ac;'S;=`!B[<%lO!AcS!B_P;=`<%l!AcS!BeSOY!@YZ;'S!@Y;'S;=`!Bq<%lO!@YS!BtP;=`<%l!@Y&n!B|[$f&jOY!BwYZ&cZ!^!Bw!^!_!Ac!_#O!Bw#O#P!Cr#P#Q!=y#Q#o!Bw#o#p!Ac#p;'S!Bw;'S;=`!Dd<%lO!Bw&n!CwX$f&jOY!BwYZ&cZ!^!Bw!^!_!Ac!_#o!Bw#o#p!Ac#p;'S!Bw;'S;=`!Dd<%lO!Bw&n!DgP;=`<%l!Bw&n!DoX$f&jOY!=yYZ&cZ!^!=y!^!_!@Y!_#o!=y#o#p!@Y#p;'S!=y;'S;=`!E[<%lO!=y&n!E_P;=`<%l!=y(Q!Eki$f&j(R!b!USOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#Z&}#Z#[!Eb#[#]&}#]#^!Eb#^#a&}#a#b!Eb#b#g&}#g#h!Eb#h#i&}#i#j!Eb#j#m&}#m#n!Eb#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!f!GaZ(R!b!USOY!GYZw!GYwx!@Yx!P!GY!P!Q!HS!Q!}!GY!}#O!Ic#O#P!Bb#P;'S!GY;'S;=`!JZ<%lO!GY!f!HZb(R!b!USOY'}Zw'}x#O'}#P#Z'}#Z#[!HS#[#]'}#]#^!HS#^#a'}#a#b!HS#b#g'}#g#h!HS#h#i'}#i#j!HS#j#m'}#m#n!HS#n;'S'};'S;=`(f<%lO'}!f!IhX(R!bOY!IcZw!Icwx!Acx#O!Ic#O#P!A{#P#Q!GY#Q;'S!Ic;'S;=`!JT<%lO!Ic!f!JWP;=`<%l!Ic!f!J^P;=`<%l!GY(Q!Jh^$f&j(R!bOY!JaYZ&cZw!Jawx!Bwx!^!Ja!^!_!Ic!_#O!Ja#O#P!Cr#P#Q!<n#Q#o!Ja#o#p!Ic#p;'S!Ja;'S;=`!Kd<%lO!Ja(Q!KgP;=`<%l!Ja(Q!KmP;=`<%l!<n'`!Ky`$f&j(Op!USOY!KpYZ&cZr!Kprs!=ys!P!Kp!P!Q!L{!Q!^!Kp!^!_!Ns!_!}!Kp!}#O##z#O#P!Dj#P#o!Kp#o#p!Ns#p;'S!Kp;'S;=`#%T<%lO!Kp'`!MUi$f&j(Op!USOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#Z(r#Z#[!L{#[#](r#]#^!L{#^#a(r#a#b!L{#b#g(r#g#h!L{#h#i(r#i#j!L{#j#m(r#m#n!L{#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rt!NzZ(Op!USOY!NsZr!Nsrs!@Ys!P!Ns!P!Q# m!Q!}!Ns!}#O#!|#O#P!Bb#P;'S!Ns;'S;=`##t<%lO!Nst# tb(Op!USOY)rZr)rs#O)r#P#Z)r#Z#[# m#[#])r#]#^# m#^#a)r#a#b# m#b#g)r#g#h# m#h#i)r#i#j# m#j#m)r#m#n# m#n;'S)r;'S;=`*Z<%lO)rt##RX(OpOY#!|Zr#!|rs!Acs#O#!|#O#P!A{#P#Q!Ns#Q;'S#!|;'S;=`##n<%lO#!|t##qP;=`<%l#!|t##wP;=`<%l!Ns'`#$R^$f&j(OpOY##zYZ&cZr##zrs!Bws!^##z!^!_#!|!_#O##z#O#P!Cr#P#Q!Kp#Q#o##z#o#p#!|#p;'S##z;'S;=`#$}<%lO##z'`#%QP;=`<%l##z'`#%WP;=`<%l!Kp(r#%fk$f&j(Op(R!b!USOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#Z%Z#Z#[#%Z#[#]%Z#]#^#%Z#^#a%Z#a#b#%Z#b#g%Z#g#h#%Z#h#i%Z#i#j#%Z#j#m%Z#m#n#%Z#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#W#'d](Op(R!b!USOY#'ZZr#'Zrs!GYsw#'Zwx!Nsx!P#'Z!P!Q#(]!Q!}#'Z!}#O#)w#O#P!Bb#P;'S#'Z;'S;=`#*w<%lO#'Z#W#(fe(Op(R!b!USOY*gZr*grs'}sw*gwx)rx#O*g#P#Z*g#Z#[#(]#[#]*g#]#^#(]#^#a*g#a#b#(]#b#g*g#g#h#(]#h#i*g#i#j#(]#j#m*g#m#n#(]#n;'S*g;'S;=`+Z<%lO*g#W#*OZ(Op(R!bOY#)wZr#)wrs!Icsw#)wwx#!|x#O#)w#O#P!A{#P#Q#'Z#Q;'S#)w;'S;=`#*q<%lO#)w#W#*tP;=`<%l#)w#W#*zP;=`<%l#'Z(r#+W`$f&j(Op(R!bOY#*}YZ&cZr#*}rs!Jasw#*}wx##zx!^#*}!^!_#)w!_#O#*}#O#P!Cr#P#Q!;Z#Q#o#*}#o#p#)w#p;'S#*};'S;=`#,Y<%lO#*}(r#,]P;=`<%l#*}(r#,cP;=`<%l!;Z(CS#,sb$f&j(Op(R!b'v(;d!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(CS#.W_$f&j(Op(R!bS(;dOY#-{YZ&cZr#-{rs#/Vsw#-{wx#2gx!^#-{!^!_#4f!_#O#-{#O#P#0X#P#o#-{#o#p#4f#p;'S#-{;'S;=`#5e<%lO#-{(Bb#/`]$f&j(R!bS(;dOY#/VYZ&cZw#/Vwx#0Xx!^#/V!^!_#1j!_#O#/V#O#P#0X#P#o#/V#o#p#1j#p;'S#/V;'S;=`#2a<%lO#/V(AO#0`X$f&jS(;dOY#0XYZ&cZ!^#0X!^!_#0{!_#o#0X#o#p#0{#p;'S#0X;'S;=`#1d<%lO#0X(;d#1QSS(;dOY#0{Z;'S#0{;'S;=`#1^<%lO#0{(;d#1aP;=`<%l#0{(AO#1gP;=`<%l#0X(<v#1qW(R!bS(;dOY#1jZw#1jwx#0{x#O#1j#O#P#0{#P;'S#1j;'S;=`#2Z<%lO#1j(<v#2^P;=`<%l#1j(Bb#2dP;=`<%l#/V(Ap#2p]$f&j(OpS(;dOY#2gYZ&cZr#2grs#0Xs!^#2g!^!_#3i!_#O#2g#O#P#0X#P#o#2g#o#p#3i#p;'S#2g;'S;=`#4`<%lO#2g(<U#3pW(OpS(;dOY#3iZr#3irs#0{s#O#3i#O#P#0{#P;'S#3i;'S;=`#4Y<%lO#3i(<U#4]P;=`<%l#3i(Ap#4cP;=`<%l#2g(=h#4oY(Op(R!bS(;dOY#4fZr#4frs#1jsw#4fwx#3ix#O#4f#O#P#0{#P;'S#4f;'S;=`#5_<%lO#4f(=h#5bP;=`<%l#4f(CS#5hP;=`<%l#-{%#W#5xb$f&j$O$Id(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z+h#7_b$W#t$f&j(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z$/l#8rp$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#:v![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#:v#S#U%Z#U#V#>Q#V#X%Z#X#Y!4|#Y#b%Z#b#c#<v#c#d#AY#d#l%Z#l#m#D[#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#;Rk$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#:v![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#:v#S#X%Z#X#Y!4|#Y#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#=R_$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#>Zd$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#?i!R!S#?i!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#?i#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#?tf$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#?i!R!S#?i!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#?i#S#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Acc$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#Bn!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#Bn#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Bye$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#Bn!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#Bn#S#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Deg$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#E|![!^%Z!^!_*g!_!c%Z!c!i#E|!i#O%Z#O#P&c#P#R%Z#R#S#E|#S#T%Z#T#Z#E|#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#FXi$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#E|![!^%Z!^!_*g!_!c%Z!c!i#E|!i#O%Z#O#P&c#P#R%Z#R#S#E|#S#T%Z#T#Z#E|#Z#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%Gh#HT_!d$b$f&j#|%<f(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#I__`l$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(@^#Jk^g!*v!h'.r(Op(R!b(tSOY*gZr*grs'}sw*gwx)rx!P*g!P!Q#Kg!Q!^*g!^!_#L]!_!`#M}!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#KpX$h&j(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#LfZ#n$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#MX!`#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#MbX$O$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#NWX#o$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g%Gh$ Oa#[%?x$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$!T!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#W$!`_#g$Ih$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%Gh$#nafBf#o$Id$c#|$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$$s!`!a$%}!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$%O_#o$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$&Ya#n$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$'_!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$'j`#n$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+h$(wc(h$Ip$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P$*S!P!^%Z!^!_*g!_!a%Z!a!b$+^!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+`$*__}'#p$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$+i`$f&j#y$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&^$,v_!{!Ln$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(@^$.Q_!P(8n$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/UZ$f&jO!^$/w!^!_$0_!_#i$/w#i#j$0d#j#l$/w#l#m$2V#m#o$/w#o#p$0_#p;'S$/w;'S;=`$4b<%lO$/w(n$0OT^#S$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0dO^#S(n$0i[$f&jO!Q&c!Q![$1_![!^&c!_!c&c!c!i$1_!i#T&c#T#Z$1_#Z#o&c#o#p$3u#p;'S&c;'S;=`&w<%lO&c(n$1dZ$f&jO!Q&c!Q![$2V![!^&c!_!c&c!c!i$2V!i#T&c#T#Z$2V#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2[Z$f&jO!Q&c!Q![$2}![!^&c!_!c&c!c!i$2}!i#T&c#T#Z$2}#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3SZ$f&jO!Q&c!Q![$/w![!^&c!_!c&c!c!i$/w!i#T&c#T#Z$/w#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$3xR!Q![$4R!c!i$4R#T#Z$4R#S$4US!Q![$4R!c!i$4R#T#Z$4R#q#r$0_(n$4eP;=`<%l$/w!2r$4s_!V!+S$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$5}`#v$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&,v$7[_$f&j(Op(R!b(X&%WOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS$8jk$f&j(Op(R!b'{&;d$[#t([!LYOY%ZYZ&cZr%Zrs&}st%Ztu$8Zuw%Zwx(rx}%Z}!O$:_!O!Q%Z!Q![$8Z![!^%Z!^!_*g!_!c%Z!c!}$8Z!}#O%Z#O#P&c#P#R%Z#R#S$8Z#S#T%Z#T#o$8Z#o#p*g#p$g%Z$g;'S$8Z;'S;=`$<e<%lO$8Z+d$:jk$f&j(Op(R!b$[#tOY%ZYZ&cZr%Zrs&}st%Ztu$:_uw%Zwx(rx}%Z}!O$:_!O!Q%Z!Q![$:_![!^%Z!^!_*g!_!c%Z!c!}$:_!}#O%Z#O#P&c#P#R%Z#R#S$:_#S#T%Z#T#o$:_#o#p*g#p$g%Z$g;'S$:_;'S;=`$<_<%lO$:_+d$<bP;=`<%l$:_(CS$<hP;=`<%l$8Z!5p$<tX![!3l(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g&CO$=la(o&;`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+^#q;'S%Z;'S;=`+a<%lO%Z%#`$?O_!Z$I`r`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(r$@Y_!pS$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS$Aj|$f&j(Op(R!b't(;d$Y#t'{&;d([!LYOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$AX#BZ$ISEr$IS$I_$AX$I_$JTEr$JT$JU$AX$JU$KVEr$KV$KW$AX$KW&FUEr&FU&FV$AX&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$AX?HUOEr(CS$Duk$f&j(Op(R!b'u(;d$Y#t'{&;d([!LYOY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [noSemicolon, incdecToken, jsx, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, insertSemicolon, new LocalTokenGroup("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOt~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!R~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(Z~~", 141, 332), new LocalTokenGroup("j~RQYZXz{^~^O'x~~aP!P!Qd~iO'y~~", 25, 315)],
  topRules: { "Script": [0, 6], "SingleExpression": [1, 269], "SingleClassItem": [2, 270] },
  dialects: { jsx: 0, ts: 14614 },
  dynamicPrecedences: { "69": 1, "79": 1, "81": 1, "165": 1, "193": 1 },
  specialized: [{ term: 319, get: (value) => spec_identifier[value] || -1 }, { term: 334, get: (value) => spec_word[value] || -1 }, { term: 70, get: (value) => spec_LessThan[value] || -1 }],
  tokenPrec: 14638
});

// node_modules/@codemirror/lang-javascript/dist/index.js
var snippets = [
  snippetCompletion("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  snippetCompletion("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  snippetCompletion("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  snippetCompletion("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  snippetCompletion("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  snippetCompletion("try {\n	${}\n} catch (${error}) {\n	${}\n}", {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  snippetCompletion("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  snippetCompletion("if (${}) {\n	${}\n} else {\n	${}\n}", {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  snippetCompletion("class ${name} {\n	constructor(${params}) {\n		${}\n	}\n}", {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  snippetCompletion('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  snippetCompletion('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
];
var typescriptSnippets = snippets.concat([
  snippetCompletion("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  snippetCompletion("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  snippetCompletion("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]);
var cache = new NodeWeakMap();
var ScopeNodes = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function defID(type) {
  return (node, def) => {
    let id2 = node.node.getChild("VariableDefinition");
    if (id2)
      def(id2, type);
    return true;
  };
}
var functionContext = ["FunctionDeclaration"];
var gatherCompletions = {
  FunctionDeclaration: defID("function"),
  ClassDeclaration: defID("class"),
  ClassExpression: () => true,
  EnumDeclaration: defID("constant"),
  TypeAliasDeclaration: defID("type"),
  NamespaceDeclaration: defID("namespace"),
  VariableDefinition(node, def) {
    if (!node.matchContext(functionContext))
      def(node, "variable");
  },
  TypeDefinition(node, def) {
    def(node, "type");
  },
  __proto__: null
};
function getScope(doc, node) {
  let cached = cache.get(node);
  if (cached)
    return cached;
  let completions = [], top = true;
  function def(node2, type) {
    let name = doc.sliceString(node2.from, node2.to);
    completions.push({ label: name, type });
  }
  node.cursor(IterMode.IncludeAnonymous).iterate((node2) => {
    if (top) {
      top = false;
    } else if (node2.name) {
      let gather = gatherCompletions[node2.name];
      if (gather && gather(node2, def) || ScopeNodes.has(node2.name))
        return false;
    } else if (node2.to - node2.from > 8192) {
      for (let c of getScope(doc, node2.node))
        completions.push(c);
      return false;
    }
  });
  cache.set(node, completions);
  return completions;
}
var Identifier = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/;
var dontComplete = [
  "TemplateString",
  "String",
  "RegExp",
  "LineComment",
  "BlockComment",
  "VariableDefinition",
  "TypeDefinition",
  "Label",
  "PropertyDefinition",
  "PropertyName",
  "PrivatePropertyDefinition",
  "PrivatePropertyName",
  ".",
  "?."
];
function localCompletionSource(context) {
  let inner = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (dontComplete.indexOf(inner.name) > -1)
    return null;
  let isWord = inner.name == "VariableName" || inner.to - inner.from < 20 && Identifier.test(context.state.sliceDoc(inner.from, inner.to));
  if (!isWord && !context.explicit)
    return null;
  let options = [];
  for (let pos = inner; pos; pos = pos.parent) {
    if (ScopeNodes.has(pos.name))
      options = options.concat(getScope(context.state.doc, pos));
  }
  return {
    options,
    from: isWord ? inner.from : context.pos,
    validFor: Identifier
  };
}
function pathFor(read, member, name) {
  var _a;
  let path = [];
  for (; ; ) {
    let obj = member.firstChild, prop;
    if ((obj === null || obj === void 0 ? void 0 : obj.name) == "VariableName") {
      path.push(read(obj));
      return { path: path.reverse(), name };
    } else if ((obj === null || obj === void 0 ? void 0 : obj.name) == "MemberExpression" && ((_a = prop = obj.lastChild) === null || _a === void 0 ? void 0 : _a.name) == "PropertyName") {
      path.push(read(prop));
      member = obj;
    } else {
      return null;
    }
  }
}
function completionPath(context) {
  let read = (node) => context.state.doc.sliceString(node.from, node.to);
  let inner = syntaxTree(context.state).resolveInner(context.pos, -1);
  if (inner.name == "PropertyName") {
    return pathFor(read, inner.parent, read(inner));
  } else if ((inner.name == "." || inner.name == "?.") && inner.parent.name == "MemberExpression") {
    return pathFor(read, inner.parent, "");
  } else if (dontComplete.indexOf(inner.name) > -1) {
    return null;
  } else if (inner.name == "VariableName" || inner.to - inner.from < 20 && Identifier.test(read(inner))) {
    return { path: [], name: read(inner) };
  } else if (inner.name == "MemberExpression") {
    return pathFor(read, inner, "");
  } else {
    return context.explicit ? { path: [], name: "" } : null;
  }
}
function enumeratePropertyCompletions(obj, top) {
  let options = [], seen = /* @__PURE__ */ new Set();
  for (let depth = 0; ; depth++) {
    for (let name of (Object.getOwnPropertyNames || Object.keys)(obj)) {
      if (!/^[a-zA-Z_$\xaa-\uffdc][\w$\xaa-\uffdc]*$/.test(name) || seen.has(name))
        continue;
      seen.add(name);
      let value;
      try {
        value = obj[name];
      } catch (_) {
        continue;
      }
      options.push({
        label: name,
        type: typeof value == "function" ? /^[A-Z]/.test(name) ? "class" : top ? "function" : "method" : top ? "variable" : "property",
        boost: -depth
      });
    }
    let next = Object.getPrototypeOf(obj);
    if (!next)
      return options;
    obj = next;
  }
}
function scopeCompletionSource(scope) {
  let cache2 = /* @__PURE__ */ new Map();
  return (context) => {
    let path = completionPath(context);
    if (!path)
      return null;
    let target = scope;
    for (let step of path.path) {
      target = target[step];
      if (!target)
        return null;
    }
    let options = cache2.get(target);
    if (!options)
      cache2.set(target, options = enumeratePropertyCompletions(target, !path.path.length));
    return {
      from: context.pos - path.name.length,
      options,
      validFor: Identifier
    };
  };
}
var javascriptLanguage = LRLanguage.define({
  name: "javascript",
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({ except: /^\s*({|else\b)/ }),
        TryStatement: continuedIndent({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: flatIndent,
        SwitchBody: (context) => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
        },
        Block: delimitedIndent({ closing: "}" }),
        ArrowFunction: (cx) => cx.baseIndent + cx.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": continuedIndent({ except: /^{/ }),
        JSXElement(context) {
          let closed = /^\s*<\//.test(context.textAfter);
          return context.lineIndent(context.node.from) + (closed ? 0 : context.unit);
        },
        JSXEscape(context) {
          let closed = /\s*\}/.test(context.textAfter);
          return context.lineIndent(context.node.from) + (closed ? 0 : context.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(context) {
          return context.column(context.node.from) + context.unit;
        }
      }),
      foldNodeProp.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
});
var jsxSublanguage = {
  test: (node) => /^JSX/.test(node.name),
  facet: defineLanguageFacet({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
};
var typescriptLanguage = javascriptLanguage.configure({ dialect: "ts" }, "typescript");
var jsxLanguage = javascriptLanguage.configure({
  dialect: "jsx",
  props: [sublanguageProp.add((n) => n.isTop ? [jsxSublanguage] : void 0)]
});
var tsxLanguage = javascriptLanguage.configure({
  dialect: "jsx ts",
  props: [sublanguageProp.add((n) => n.isTop ? [jsxSublanguage] : void 0)]
}, "typescript");
var kwCompletion = (name) => ({ label: name, type: "keyword" });
var keywords = "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(kwCompletion);
var typescriptKeywords = keywords.concat(["declare", "implements", "private", "protected", "public"].map(kwCompletion));
function javascript(config = {}) {
  let lang = config.jsx ? config.typescript ? tsxLanguage : jsxLanguage : config.typescript ? typescriptLanguage : javascriptLanguage;
  let completions = config.typescript ? typescriptSnippets.concat(typescriptKeywords) : snippets.concat(keywords);
  return new LanguageSupport(lang, [
    javascriptLanguage.data.of({
      autocomplete: ifNotIn(dontComplete, completeFromList(completions))
    }),
    javascriptLanguage.data.of({
      autocomplete: localCompletionSource
    }),
    config.jsx ? autoCloseTags : []
  ]);
}
function findOpenTag(node) {
  for (; ; ) {
    if (node.name == "JSXOpenTag" || node.name == "JSXSelfClosingTag" || node.name == "JSXFragmentTag")
      return node;
    if (node.name == "JSXEscape" || !node.parent)
      return null;
    node = node.parent;
  }
}
function elementName(doc, tree, max = doc.length) {
  for (let ch = tree === null || tree === void 0 ? void 0 : tree.firstChild; ch; ch = ch.nextSibling) {
    if (ch.name == "JSXIdentifier" || ch.name == "JSXBuiltin" || ch.name == "JSXNamespacedName" || ch.name == "JSXMemberExpression")
      return doc.sliceString(ch.from, Math.min(ch.to, max));
  }
  return "";
}
var android = typeof navigator == "object" && /Android\b/.test(navigator.userAgent);
var autoCloseTags = EditorView.inputHandler.of((view, from, to, text, defaultInsert) => {
  if ((android ? view.composing : view.compositionStarted) || view.state.readOnly || from != to || text != ">" && text != "/" || !javascriptLanguage.isActiveAt(view.state, from, -1))
    return false;
  let base = defaultInsert(), { state } = base;
  let closeTags = state.changeByRange((range) => {
    var _a;
    let { head } = range, around = syntaxTree(state).resolveInner(head - 1, -1), name;
    if (around.name == "JSXStartTag")
      around = around.parent;
    if (state.doc.sliceString(head - 1, head) != text || around.name == "JSXAttributeValue" && around.to > head)
      ;
    else if (text == ">" && around.name == "JSXFragmentTag") {
      return { range, changes: { from: head, insert: `</>` } };
    } else if (text == "/" && around.name == "JSXStartCloseTag") {
      let empty = around.parent, base2 = empty.parent;
      if (base2 && empty.from == head - 2 && ((name = elementName(state.doc, base2.firstChild, head)) || ((_a = base2.firstChild) === null || _a === void 0 ? void 0 : _a.name) == "JSXFragmentTag")) {
        let insert = `${name}>`;
        return { range: EditorSelection.cursor(head + insert.length, -1), changes: { from: head, insert } };
      }
    } else if (text == ">") {
      let openTag = findOpenTag(around);
      if (openTag && openTag.name == "JSXOpenTag" && !/^\/?>|^<\//.test(state.doc.sliceString(head, head + 2)) && (name = elementName(state.doc, openTag, head)))
        return { range, changes: { from: head, insert: `</${name}>` } };
    }
    return { range };
  });
  if (closeTags.changes.empty)
    return false;
  view.dispatch([
    base,
    state.update(closeTags, { userEvent: "input.complete", scrollIntoView: true })
  ]);
  return true;
});
function esLint(eslint, config) {
  if (!config) {
    config = {
      parserOptions: { ecmaVersion: 2019, sourceType: "module" },
      env: { browser: true, node: true, es6: true, es2015: true, es2017: true, es2020: true },
      rules: {}
    };
    eslint.getRules().forEach((desc, name) => {
      if (desc.meta.docs.recommended)
        config.rules[name] = 2;
    });
  }
  return (view) => {
    let { state } = view, found = [];
    for (let { from, to } of javascriptLanguage.findRegions(state)) {
      let fromLine = state.doc.lineAt(from), offset = { line: fromLine.number - 1, col: from - fromLine.from, pos: from };
      for (let d of eslint.verify(state.sliceDoc(from, to), config))
        found.push(translateDiagnostic(d, state.doc, offset));
    }
    return found;
  };
}
function mapPos(line, col, doc, offset) {
  return doc.line(line + offset.line).from + col + (line == 1 ? offset.col - 1 : -1);
}
function translateDiagnostic(input, doc, offset) {
  let start = mapPos(input.line, input.column, doc, offset);
  let result = {
    from: start,
    to: input.endLine != null && input.endColumn != 1 ? mapPos(input.endLine, input.endColumn, doc, offset) : start,
    message: input.message,
    source: input.ruleId ? "eslint:" + input.ruleId : "eslint",
    severity: input.severity == 1 ? "warning" : "error"
  };
  if (input.fix) {
    let { range, text } = input.fix, from = range[0] + offset.pos - start, to = range[1] + offset.pos - start;
    result.actions = [{
      name: "fix",
      apply(view, start2) {
        view.dispatch({ changes: { from: start2 + from, to: start2 + to, insert: text }, scrollIntoView: true });
      }
    }];
  }
  return result;
}
export {
  autoCloseTags,
  completionPath,
  esLint,
  javascript,
  javascriptLanguage,
  jsxLanguage,
  localCompletionSource,
  scopeCompletionSource,
  snippets,
  tsxLanguage,
  typescriptLanguage,
  typescriptSnippets
};
//# sourceMappingURL=@codemirror_lang-javascript.js.map

import { get, isString } from 'lodash';
import { ExecutionState } from '@activepieces/shared';
import { connectionService } from './connections.service';

export class VariableService {
  private VARIABLE_TOKEN = RegExp('\\{\\{(.*?)\\}\\}', 'g');
  private static CONNECTIONS = 'connections';
  private async resolveInput(input: string, valuesMap: Record<string, unknown>, censorConnections: boolean): Promise<any> {
    // If input contains only a variable token, return the value of the variable while maintaining the variable type.
    const matchedTokens = input.match(this.VARIABLE_TOKEN);
    if (
      matchedTokens !== null &&
      matchedTokens.length === 1 &&
      matchedTokens[0] === input
    ) {
      const variableName = input.substring(2, input.length - 2);
      if (variableName.startsWith(VariableService.CONNECTIONS)) {
        return this.handleTypeAndResolving(variableName, censorConnections);
      }
      return this.evalInScope(variableName, valuesMap);
    }
    return input.replace(this.VARIABLE_TOKEN, (_match, variable) => {
      const result = this.evalInScope(variable, valuesMap);
      if (!isString(result)) {
        return JSON.stringify(result);
      }
      return result;
    });
  }

  private async handleTypeAndResolving(path: string, censorConnections: boolean): Promise<any> {
    const paths = path.split(".");
    // Invalid naming return nothing
    if (paths.length < 2) {
      return '';
    }
    if (censorConnections) {
      return "**CENSORED**";
    }
    // Need to be resolved dynamically
    const connectioName = paths[1];
    paths.splice(0, 2);
    const newPath = paths.join(".");
    const connection = (await connectionService.obtain(connectioName));
    if (paths.length === 0) {
      return connection;
    }
    return VariableService.copyFromMap(connection, newPath);
  }

  private static copyFromMap(valuesMap: any, path: string) {
    const value = get(valuesMap, path);
    if (value === undefined) {
      return '';
    }
    return value;
  }


  private evalInScope(js: string, contextAsScope: Record<string, unknown>) {
    try {
      const keys = Object.keys(contextAsScope);
      const values = Object.values(contextAsScope);
      const functionBody = `return (${js})`;
      const evaluatedFn = new Function(...keys, functionBody);
      const result = evaluatedFn(...values);
      return result ?? "";
    } catch (exception) {
      console.warn('Error evaluating expression', exception);
      return "";
    }
  }

  private async resolveInternally(unresolvedInput: any, valuesMap: any, censorConnections: boolean): Promise<any> {
    if (unresolvedInput === undefined || unresolvedInput === null) {
      return unresolvedInput;
    } else if (isString(unresolvedInput)) {
      return this.resolveInput(unresolvedInput, valuesMap, censorConnections);
    } else if (Array.isArray(unresolvedInput)) {
      for (let i = 0; i < unresolvedInput.length; ++i) {
        unresolvedInput[i] = await this.resolveInternally(unresolvedInput[i], valuesMap, censorConnections);
      }
    } else if (typeof unresolvedInput === 'object') {
      const entries = Object.entries(unresolvedInput);
      for (let i = 0; i < entries.length; ++i) {
        const [key, value] = entries[i];
        unresolvedInput[key] = await this.resolveInternally(value, valuesMap, censorConnections);
      }
    }
    return unresolvedInput;
  }

  private getExecutionStateObject(executionState: ExecutionState): Record<string, unknown> {
    const valuesMap: Record<string, unknown> = {}
    Object.entries(executionState.lastStepState).forEach(([key, value]) => {
      valuesMap[key] = value;
    });
    return valuesMap;
  }

  resolve(unresolvedInput: any, executionState: ExecutionState, censorConnections = false): Promise<any> {
    return this.resolveInternally(
      JSON.parse(JSON.stringify(unresolvedInput)),
      this.getExecutionStateObject(executionState),
      censorConnections
    );
  }
}

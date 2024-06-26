import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';

import { FlowService, FoldersService } from '@activepieces/ui/common';
import { InstanceRunService } from '@activepieces/ui/common';
import { Flow, FlowRun, Folder } from '@activepieces/shared';

export type InstanceRunInfo = {
  flow: Flow;
  run: FlowRun;
  folder?: Folder;
};

@Injectable({
  providedIn: 'root',
})
export class GetInstanceRunResolver
  implements Resolve<Observable<InstanceRunInfo>>
{
  constructor(
    private instanceRunService: InstanceRunService,
    private flowService: FlowService,
    private folderService: FoldersService
  ) {}

  resolve(snapshot: ActivatedRouteSnapshot): Observable<InstanceRunInfo> {
    const runId = snapshot.paramMap.get('runId') as string;
    return this.instanceRunService.get(runId).pipe(
      switchMap((run) => {
        return this.flowService.get(run.flowId, run.flowVersionId).pipe(
          switchMap((flow) => {
            if (!flow.folderId) {
              return of({ flow: flow, run: run });
            }
            return this.folderService.get(flow.folderId).pipe(
              map((folder) => {
                return { flow: flow, run: run, folder };
              })
            );
          })
        );
      })
    );
  }
}

/*
  Warnings:

  - The primary key for the `RolePermissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RolePermissions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RolePermissions_roleId_permissionId_key";

-- AlterTable
ALTER TABLE "RolePermissions" DROP CONSTRAINT "RolePermissions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("roleId", "permissionId");

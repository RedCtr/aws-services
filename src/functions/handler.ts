export const checkInventory = async ({ source }: { source: string }) => {
    try {
        return {
            source,
            userName: "Red",
            lastName: "Ctr"
        }
    } catch (error) {
        return { source }
    }
}